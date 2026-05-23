const { connectDatabase, Counter, User, Meal, NutritionPlan } = require('./src/models');

async function getNextId(counterName) {
  const doc = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();
  return doc.seq;
}

async function initDb() {
  try {
    await connectDatabase();
    console.log('✅ [DB] Conectado a MongoDB correctamente.');
  } catch (err) {
    console.error('❌ [DB] No se pudo conectar a MongoDB:', err.message);
    throw err;
  }
}

async function createUser({ name, age, weight, height, gender, email, password }) {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    throw new Error('El correo ya está registrado.');
  }

  const newUserId = await getNextId('users');
  const user = await User.create({
    id: newUserId,
    name,
    age: age !== undefined ? age : null,
    weight: weight !== undefined ? weight : null,
    height: height !== undefined ? height : null,
    gender: gender || null,
    email: normalizedEmail,
    password,
    activity_level: 'moderado',
    target_weight: weight !== undefined ? weight : null,
    food_preference: 'ninguna'
  });

  return {
    id: user.id,
    name: user.name,
    age: user.age,
    weight: user.weight,
    height: user.height,
    gender: user.gender,
    email: user.email,
    activity_level: user.activity_level,
    target_weight: user.target_weight,
    food_preference: user.food_preference,
    created_at: user.created_at
  };
}

async function getUserByEmail(email) {
  const user = await User.findOne(
    { email: email.toLowerCase() },
    { _id: 0 }
  ).lean();
  return user || null;
}

async function getUserById(id) {
  const user = await User.findOne(
    { id: parseInt(id, 10) },
    { _id: 0, password: 0 }
  ).lean();
  return user || null;
}

async function updateUser(
  id,
  { name, age, weight, height, gender, activity_level, target_weight, food_preference }
) {
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (age !== undefined) updates.age = age || null;
  if (weight !== undefined) updates.weight = weight || null;
  if (height !== undefined) updates.height = height || null;
  if (gender !== undefined) updates.gender = gender;
  if (activity_level !== undefined) updates.activity_level = activity_level;
  if (target_weight !== undefined) updates.target_weight = target_weight || null;
  if (food_preference !== undefined) updates.food_preference = food_preference;

  const updated = await User.findOneAndUpdate(
    { id: parseInt(id, 10) },
    { $set: updates },
    {
      new: true,
      projection: { _id: 0, password: 0 }
    }
  ).lean();

  if (!updated) {
    throw new Error('Usuario no encontrado');
  }

  return updated;
}

async function addMeal({ userId, type, name, calories, proteins, carbs, fats }) {
  const newMealId = await getNextId('meals');
  const meal = await Meal.create({
    id: newMealId,
    user_id: parseInt(userId, 10),
    type,
    name,
    calories: parseInt(calories, 10) || 0,
    proteins: parseInt(proteins, 10) || 0,
    carbs: parseInt(carbs, 10) || 0,
    fats: parseInt(fats, 10) || 0
  });

  return {
    id: meal.id,
    user_id: meal.user_id,
    type: meal.type,
    name: meal.name,
    calories: meal.calories,
    proteins: meal.proteins,
    carbs: meal.carbs,
    fats: meal.fats,
    created_at: meal.created_at
  };
}

async function getMeals(userId) {
  return Meal.find({ user_id: parseInt(userId, 10) }, { _id: 0 })
    .sort({ created_at: -1 })
    .lean();
}

async function getPlans(userId) {
  const plan = await NutritionPlan.findOne(
    { user_id: parseInt(userId, 10) },
    { _id: 0 }
  )
    .sort({ created_at: -1 })
    .lean();
  return plan || null;
}

async function savePlan(userId, content) {
  const newPlanId = await getNextId('nutrition_plans');
  const plan = await NutritionPlan.create({
    id: newPlanId,
    user_id: parseInt(userId, 10),
    content: typeof content === 'string' ? content : JSON.stringify(content)
  });

  return {
    id: plan.id,
    user_id: plan.user_id,
    content: plan.content,
    created_at: plan.created_at
  };
}

module.exports = {
  initDb,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  addMeal,
  getMeals,
  getPlans,
  savePlan
};
