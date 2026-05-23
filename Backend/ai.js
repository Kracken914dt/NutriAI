const axios = require('axios');

// Helper to calculate BMR and Daily Calorie Needs
function calculateNutrientNeeds(user) {
  const weight = parseFloat(user.weight) || 70;
  const height = parseFloat(user.height) || 170;
  const age = parseInt(user.age) || 30;
  const gender = user.gender || 'm';
  const activity = user.activity_level || 'moderado';

  // Harris-Benedict BMR
  let bmr = 0;
  if (gender.toLowerCase().startsWith('m')) {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // TDEE multiplier
  let multiplier = 1.2; // sedentario
  if (activity === 'ligero') multiplier = 1.375;
  if (activity === 'moderado') multiplier = 1.55;
  if (activity === 'activo') multiplier = 1.725;
  if (activity === 'muy activo') multiplier = 1.9;

  let tdee = Math.round(bmr * multiplier);

  // Goal adjustment
  const goal = user.food_preference || 'ninguna'; // Use preference or custom goals
  const targetWeight = parseFloat(user.target_weight) || weight;
  
  let targetCalories = tdee;
  let goalText = 'Mantenimiento';
  if (targetWeight < weight - 1) {
    targetCalories = Math.max(tdee - 450, 1200);
    goalText = 'Pérdida de peso';
  } else if (targetWeight > weight + 1) {
    targetCalories = tdee + 300;
    goalText = 'Aumento de masa muscular';
  }

  // Macros: Protein (2g per kg), Fats (1g per kg), Carbs (remainder)
  const proteinGrams = Math.round(weight * 1.8);
  const fatGrams = Math.round(weight * 0.9);
  const carbCalories = targetCalories - (proteinGrams * 4) - (fatGrams * 9);
  const carbGrams = Math.round(Math.max(carbCalories, 0) / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    goalText,
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams
  };
}

// Generate weekly diet plan in JSON format
function simulateWeeklyPlan(user) {
  const needs = calculateNutrientNeeds(user);
  
  const breakfasts = [
    { name: "Avena con plátano y nueces", cal: 350, prot: 12, carbs: 55, fats: 10 },
    { name: "Tortilla de 3 claras y 1 huevo entero con espinacas y aguacate", cal: 320, prot: 20, carbs: 8, fats: 18 },
    { name: "Yogur griego natural con fresas, chía y almendras", cal: 280, prot: 18, carbs: 22, fats: 12 },
    { name: "Tostadas integrales con hummus y huevo poché", cal: 340, prot: 16, carbs: 40, fats: 12 },
    { name: "Batido de proteína de vainilla con leche de almendra y espinaca", cal: 260, prot: 25, carbs: 15, fats: 6 }
  ];

  const lunches = [
    { name: "Pechuga de pollo a la plancha con quinoa y brócoli al vapor", cal: 520, prot: 45, carbs: 50, fats: 10 },
    { name: "Filete de salmón al horno con espárragos y camote asado", cal: 580, prot: 38, carbs: 42, fats: 22 },
    { name: "Tazón de frijoles negros, arroz integral, aguacate y carne magra", cal: 600, prot: 35, carbs: 65, fats: 16 },
    { name: "Ensalada templada de pavo con garbanzos, espinacas y aderezo de oliva", cal: 480, prot: 40, carbs: 38, fats: 14 },
    { name: "Atún a la parrilla con ensalada de quinoa, pepino y tomate", cal: 460, prot: 42, carbs: 35, fats: 12 }
  ];

  const dinners = [
    { name: "Pescado blanco (merluza) al papillote con calabacín y zanahoria", cal: 320, prot: 30, carbs: 15, fats: 8 },
    { name: "Revuelto de tofu con champiñones, pimientos y espinacas", cal: 280, prot: 22, carbs: 12, fats: 14 },
    { name: "Sopa de lentejas casera con verduras y pechuga de pavo picada", cal: 380, prot: 28, carbs: 45, fats: 6 },
    { name: "Fajitas de pollo envueltas en hojas de lechuga con guacamole", cal: 360, prot: 35, carbs: 10, fats: 18 },
    { name: "Crema de calabaza (sin crema) con semillas de calabaza y huevo cocido", cal: 290, prot: 14, carbs: 28, fats: 12 }
  ];

  const snacks = [
    { name: "Una manzana mediana con 15 almendras", cal: 180, prot: 4, carbs: 22, fats: 10 },
    { name: "Queso cottage bajo en grasa con piña picada", cal: 150, prot: 14, carbs: 15, fats: 3 },
    { name: "Zanahorias baby con 2 cucharadas de hummus", cal: 120, prot: 3, carbs: 18, fats: 5 },
    { name: "Puñado de nueces mixtas y un té verde", cal: 200, prot: 5, carbs: 8, fats: 18 },
    { name: "Barrita de proteína baja en azúcar", cal: 190, prot: 20, carbs: 15, fats: 6 }
  ];

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const plan = {};

  days.forEach((day, index) => {
    // Generate simple deterministic selections based on index
    const breakfast = breakfasts[index % breakfasts.length];
    const lunch = lunches[(index + 1) % lunches.length];
    const dinner = dinners[(index + 2) % dinners.length];
    const snack = snacks[(index + 3) % snacks.length];
    
    const dailyTotalCal = breakfast.cal + lunch.cal + dinner.cal + snack.cal;
    const dailyTotalProt = breakfast.prot + lunch.prot + dinner.prot + snack.prot;
    const dailyTotalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs;
    const dailyTotalFats = breakfast.fats + lunch.fats + dinner.fats + snack.fats;

    plan[day] = {
      desayuno: breakfast,
      almuerzo: lunch,
      cena: dinner,
      snack: snack,
      totals: {
        calories: dailyTotalCal,
        proteins: dailyTotalProt,
        carbs: dailyTotalCarbs,
        fats: dailyTotalFats
      }
    };
  });

  return {
    userGoals: {
      name: user.name,
      bmi: ((parseFloat(user.weight) || 70) / Math.pow((parseFloat(user.height) || 170) / 100, 2)).toFixed(1),
      dailyCalories: needs.targetCalories,
      macros: {
        proteins: `${needs.protein}g`,
        carbs: `${needs.carbs}g`,
        fats: `${needs.fats}g`
      },
      goalText: needs.goalText,
      activityLevel: user.activity_level,
      foodPreference: user.food_preference
    },
    weeklyPlan: plan
  };
}

// Generate chat completion using local intelligence
function simulateChat(userMessage, userData, mealHistory) {
  const name = userData ? userData.name : 'Usuario';
  const weight = userData ? userData.weight : 70;
  const height = userData ? userData.height : 170;
  const bmi = userData ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '24.2';
  const needs = userData ? calculateNutrientNeeds(userData) : { targetCalories: 2000, protein: 120, carbs: 200, fats: 60 };

  const msg = userMessage.toLowerCase();
  
  if (msg.includes('bajar') || msg.includes('perder') || msg.includes('peso') || msg.includes('adelgazar') || msg.includes('deficit')) {
    return `Hola ${name}. Según tus datos físicos (Peso: ${weight} kg, IMC: ${bmi}), tu gasto calórico diario estimado es de aproximadamente ${needs.tdee} kcal.
    
Para perder peso de manera saludable y sostenible (nutrición preventiva), te recomiendo un déficit calórico moderado de unas 400-500 calorías diarias:
1. **Calorías Objetivo**: Intenta consumir alrededor de **${needs.targetCalories} kcal** al día.
2. **Macronutrientes recomendados**:
   - **Proteínas**: ${needs.protein}g al día (ideal para proteger tu masa muscular mientras pierdes grasa).
   - **Carbohidratos**: ${needs.carbs}g al día (preferiblemente complejos como avena, quinoa y vegetales).
   - **Grasas**: ${needs.fats}g al día (fuentes saludables como aguacate, frutos secos y aceite de oliva).
3. **Consejo clave**: Prioriza alimentos densos en nutrientes y altos en fibra para aumentar la saciedad. Evita azúcares añadidos y ultraprocesados.

¿Te gustaría que generemos un plan de comidas detallado con estas características?`;
  }

  if (msg.includes('proteina') || msg.includes('musculo') || msg.includes('masa') || msg.includes('ganar') || msg.includes('fuerza')) {
    return `Hola ${name}. Para lograr una hipertrofia muscular o aumento de masa libre de grasa de forma óptima:
    
1. **Consumo Proteico**: Tu meta diaria recomendada es de **${needs.protein}g de proteína** (~1.8g a 2g por kilogramo de peso corporal).
2. **Distribución en comidas**: Divide esta cantidad en 4 o 5 porciones de 25-35g a lo largo del día. Por ejemplo:
   - *Desayuno*: Tortilla de huevos con espinacas o yogur griego.
   - *Almuerzo*: Pechuga de pollo o lomo de atún con arroz integral.
   - *Post-Entrenamiento*: Batido de proteína de suero o queso cottage con almendras.
   - *Cena*: Pescado azul (salmón o trucha) con vegetales salteados.
3. **Superávit Calórico**: Deberías consumir unas **${needs.targetCalories + 200} kcal** diarias para apoyar la síntesis muscular sin acumular grasa excesiva.

Recuerda que el estímulo del entrenamiento de fuerza es indispensable para que estas proteínas se conviertan en músculo.`;
  }

  if (msg.includes('caloria') || msg.includes('comer') || msg.includes('comida') || msg.includes('hoy') || msg.includes('dieta')) {
    let historySummary = '';
    if (mealHistory && mealHistory.length > 0) {
      const todayMeals = mealHistory.slice(0, 3);
      const totalCal = todayMeals.reduce((acc, curr) => acc + curr.calories, 0);
      historySummary = `Hoy has registrado ${todayMeals.length} comidas, sumando un total de **${totalCal} kcal**. `;
    } else {
      historySummary = 'Aún no has registrado comidas el día de hoy. ';
    }

    return `Hola ${name}. ${historySummary}Tu objetivo diario estimado es de **${needs.targetCalories} kcal** para tu meta.
    
Para distribuir adecuadamente tus calorías, te sugiero un esquema clásico:
- **Desayuno (25%)**: ~${Math.round(needs.targetCalories * 0.25)} kcal (rico en grasas saludables y proteínas).
- **Almuerzo (35%)**: ~${Math.round(needs.targetCalories * 0.35)} kcal (comida principal con carbohidratos complejos y proteína magra).
- **Merienda/Snack (15%)**: ~${Math.round(needs.targetCalories * 0.15)} kcal (fruta, frutos secos o yogur).
- **Cena (25%)**: ~${Math.round(needs.targetCalories * 0.25)} kcal (ligera, con vegetales y proteínas de fácil digestión).

¿Qué alimento en particular te gustaría analizar hoy?`;
  }

  if (msg.includes('azucar') || msg.includes('dulce') || msg.includes('glucosa') || msg.includes('diabetes')) {
    return `Hola ${name}. Mantener niveles estables de glucosa en sangre es el pilar de la nutrición preventiva.
    
Aquí tienes 3 recomendaciones para regular el azúcar y prevenir picos de insulina:
1. **Acompañamiento inteligente**: Nunca consumas carbohidratos simples (como frutas o pan) solos. Acompáñalos con grasas saludables (como almendras) o proteínas para ralentizar la absorción de la glucosa.
2. **El orden de los factores**: En tus comidas principales, come primero los vegetales (fibra), luego las proteínas/grasas, y al final los carbohidratos. Esto reduce el impacto glucémico en más de un 30%.
3. **Actividad postprandial**: Da una caminata ligera de 10-15 minutos inmediatamente después de tus comidas principales para ayudar a tus músculos a absorber la glucosa sin necesidad de producir insulina excesiva.`;
  }

  // General healthy fallback
  return `Hola ${name}. Soy tu asistente de NutriAI de precisión. 

He revisado tu perfil actual:
- **Edad**: ${userData?.age || 30} años
- **Peso actual**: ${weight} kg
- **Meta calórica**: ${needs.targetCalories} kcal diarias (para ${needs.goalText.toLowerCase()})

Como plataforma de nutrición preventiva, te aconsejo enfocar tu nutrición en alimentos antiinflamatorios (ricos en Omega-3, polifenoles y fibra soluble) y mantener una hidratación de al menos 2.5 a 3 litros de agua diarios.

¿Tienes alguna duda específica sobre suplementación, distribución de tus macronutrientes, o cómo mejorar tu digestión?`;
}

// MAIN EXPORTS
async function chatWithAi(userMessage, userData, mealHistory) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (apiKey) {
    try {
      const needs = calculateNutrientNeeds(userData);
      const systemPrompt = `Eres NutriAI, un asistente virtual experto en nutrición preventiva, longevidad y salud metabólica. 
Ayudas a usuarios a optimizar su alimentación basándote en sus datos físicos y hábitos.
Sé amigable, científico, claro y empoderador.
Datos del usuario actual:
- Nombre: ${userData.name}
- Edad: ${userData.age} años
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- Género: ${userData.gender}
- Nivel de actividad: ${userData.activity_level}
- Preferencias/Meta: ${userData.food_preference}
Objetivos calculados de NutriAI:
- Calorías objetivo: ${needs.targetCalories} kcal
- Proteínas: ${needs.protein}g, Carbohidratos: ${needs.carbs}g, Grasas: ${needs.fats}g

Historial de comidas recientes del usuario: ${JSON.stringify(mealHistory || [])}

Responde de manera concisa y profesional en español.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (err) {
      console.error('❌ [AI] Error with OpenAI API Chat, using fallback simulation:', err.message);
      return simulateChat(userMessage, userData, mealHistory);
    }
  }

  // No API Key, use local simulation
  return simulateChat(userMessage, userData, mealHistory);
}

async function generateNutritionPlan(userData) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const needs = calculateNutrientNeeds(userData);
      const prompt = `Genera un plan de alimentación estructurado semanal (Lunes a Domingo) para un usuario con los siguientes datos:
Nombre: ${userData.name}
Edad: ${userData.age} años
Peso: ${userData.weight} kg
Altura: ${userData.height} cm
Género: ${userData.gender}
Nivel de Actividad: ${userData.activity_level}
Preferencia/Objetivo: ${userData.food_preference}

Calculado por NutriAI: ${needs.targetCalories} kcal diarias, Proteínas: ${needs.protein}g, Carbohidratos: ${needs.carbs}g, Grasas: ${needs.fats}g.

RESPONDE EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO. No agregues markdown (\`\`\`json) ni introducciones. El formato exacto de salida debe ser:
{
  "userGoals": {
    "name": "${userData.name}",
    "bmi": "${(userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1)}",
    "dailyCalories": ${needs.targetCalories},
    "macros": {
      "proteins": "${needs.protein}g",
      "carbs": "${needs.carbs}g",
      "fats": "${needs.fats}g"
    },
    "goalText": "${needs.goalText}",
    "activityLevel": "${userData.activity_level}",
    "foodPreference": "${userData.food_preference}"
  },
  "weeklyPlan": {
    "Lunes": {
      "desayuno": { "name": "...", "cal": 300, "prot": 20, "carbs": 30, "fats": 10 },
      "almuerzo": { "name": "...", "cal": 600, "prot": 40, "carbs": 60, "fats": 15 },
      "cena": { "name": "...", "cal": 400, "prot": 30, "carbs": 20, "fats": 12 },
      "snack": { "name": "...", "cal": 200, "prot": 10, "carbs": 15, "fats": 8 },
      "totals": { "calories": 1500, "proteins": 100, "carbs": 125, "fats": 45 }
    },
    ... repetir para Martes, Miércoles, Jueves, Viernes, Sábado, Domingo ...
  }
}`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
      console.error('❌ [AI] Error with OpenAI API Plan Generation, using fallback simulation:', err.message);
      return simulateWeeklyPlan(userData);
    }
  }

  // No API Key, use local simulation
  return simulateWeeklyPlan(userData);
}

module.exports = {
  chatWithAi,
  generateNutritionPlan
};
