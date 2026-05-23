require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const ai = require('./ai');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nutriai_jwt_secret_key_12345';

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
}

// 1. AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, age, weight, height, gender, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.createUser({
      name,
      age: age ? parseInt(age) : null,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      gender: gender || 'm',
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error interno del servidor al registrar.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Credenciales incorrectas.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales incorrectas.' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPass } = user;
    res.json({ token, user: userWithoutPass });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
  }
});

// 2. USER PROFILE ROUTES
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateUser(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
});

// 3. MEALS ROUTES
app.post('/api/meals', authenticateToken, async (req, res) => {
  try {
    const { type, name, calories, proteins, carbs, fats } = req.body;
    if (!type || !name || calories === undefined) {
      return res.status(400).json({ error: 'Tipo de comida, nombre y calorías son obligatorios.' });
    }

    const newMeal = await db.addMeal({
      userId: req.user.id,
      type,
      name,
      calories: parseInt(calories),
      proteins: parseInt(proteins) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0
    });

    res.status(201).json(newMeal);
  } catch (err) {
    console.error('Meal logging error:', err);
    res.status(500).json({ error: 'Error al registrar la comida.' });
  }
});

app.get('/api/meals', authenticateToken, async (req, res) => {
  try {
    const meals = await db.getMeals(req.user.id);
    res.json(meals);
  } catch (err) {
    console.error('Fetch meals error:', err);
    res.status(500).json({ error: 'Error al obtener las comidas.' });
  }
});

// 4. PLAN ROUTES
app.get('/api/plans', authenticateToken, async (req, res) => {
  try {
    let plan = await db.getPlans(req.user.id);
    
    // If no plan generated yet, generate a default one
    if (!plan) {
      const user = await db.getUserById(req.user.id);
      const generatedPlanContent = await ai.generateNutritionPlan(user);
      plan = await db.savePlan(req.user.id, generatedPlanContent);
    }
    
    // Parse content if it is stored as text in DB
    const planContent = typeof plan.content === 'string' ? JSON.parse(plan.content) : plan.content;
    res.json({ id: plan.id, created_at: plan.created_at, plan: planContent });
  } catch (err) {
    console.error('Fetch plan error:', err);
    res.status(500).json({ error: 'Error al obtener el plan alimenticio.' });
  }
});

app.post('/api/plans/generate', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const generatedPlanContent = await ai.generateNutritionPlan(user);
    const savedPlan = await db.savePlan(req.user.id, generatedPlanContent);
    
    res.json({ id: savedPlan.id, created_at: savedPlan.created_at, plan: generatedPlanContent });
  } catch (err) {
    console.error('Generate plan error:', err);
    res.status(500).json({ error: 'Error al generar el plan alimenticio.' });
  }
});

// 5. AI CHAT ROUTE
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    const user = await db.getUserById(req.user.id);
    const meals = await db.getMeals(req.user.id);
    
    const reply = await ai.chatWithAi(message, user, meals);
    res.json({ response: reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Error al procesar la respuesta de la IA.' });
  }
});

// Start Database and Server
async function startServer() {
  await db.initDb();
  app.listen(PORT, () => {
    console.log(`🚀 [Server] NutriAI Backend running on port ${PORT}`);
  });
}

startServer();
