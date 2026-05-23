import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { 
  TrendingDown, 
  Flame, 
  Heart, 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Droplet,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('nutriai_water_today');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(`${API_URL}/user/profile`);
      setUser(userRes.data);
      const mealsRes = await axios.get(`${API_URL}/meals`);
      setMeals(mealsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = () => {
    const newVal = Math.min(waterGlasses + 1, 12);
    setWaterGlasses(newVal);
    localStorage.setItem('nutriai_water_today', newVal.toString());
  };

  const handleResetWater = () => {
    setWaterGlasses(0);
    localStorage.setItem('nutriai_water_today', '0');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate stats
  const weight = parseFloat(user?.weight) || 70;
  const height = parseFloat(user?.height) || 170;
  const heightMeters = height / 100;
  const imc = heightMeters > 0 ? (weight / (heightMeters * heightMeters)).toFixed(1) : '24.2';
  
  let imcCategory = 'Normal';
  let imcColor = 'text-primary';
  const imcVal = parseFloat(imc);
  if (imcVal < 18.5) {
    imcCategory = 'Bajo peso';
    imcColor = 'text-yellow-600';
  } else if (imcVal >= 25 && imcVal < 29.9) {
    imcCategory = 'Sobrepeso';
    imcColor = 'text-orange-500';
  } else if (imcVal >= 30) {
    imcCategory = 'Obesidad';
    imcColor = 'text-red-500';
  }

  // Calculate daily calories and targets
  // Simple Harris Benedict approximation
  const age = parseInt(user?.age) || 30;
  const gender = user?.gender || 'm';
  const activity = user?.activity_level || 'moderado';
  
  let bmr = 0;
  if (gender === 'm') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  let multiplier = 1.2;
  if (activity === 'ligero') multiplier = 1.375;
  if (activity === 'moderado') multiplier = 1.55;
  if (activity === 'activo') multiplier = 1.725;
  if (activity === 'muy activo') multiplier = 1.9;
  
  let targetCalories = Math.round(bmr * multiplier);
  const targetWeight = parseFloat(user?.target_weight) || weight;
  
  if (targetWeight < weight - 1) {
    targetCalories = Math.max(targetCalories - 450, 1200);
  } else if (targetWeight > weight + 1) {
    targetCalories += 300;
  }

  // Filter today's meals
  const today = new Date().toDateString();
  const todayMeals = meals.filter(meal => new Date(meal.created_at).toDateString() === today);
  const caloriesLogged = todayMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const proteinLogged = todayMeals.reduce((acc, curr) => acc + curr.proteins, 0);
  const carbsLogged = todayMeals.reduce((acc, curr) => acc + curr.carbs, 0);
  const fatsLogged = todayMeals.reduce((acc, curr) => acc + curr.fats, 0);

  // Generate automated insights/alerts
  const alerts = [];
  
  // 1. Sugar/Carbs check
  if (carbsLogged > (weight * 3.5)) {
    alerts.push({
      type: 'warning',
      title: 'Exceso de Carbohidratos',
      desc: 'Tu consumo de carbohidratos es elevado para el día de hoy. Intenta balancear con grasas saludables en la cena.',
      icon: AlertTriangle,
      color: 'border-error/50 bg-error-container/5 text-error'
    });
  }
  
  // 2. Protein check
  const proteinGoal = Math.round(weight * 1.5);
  if (proteinLogged < 45 && todayMeals.length >= 2) {
    alerts.push({
      type: 'deficit',
      title: 'Déficit de Proteína',
      desc: `Llevas ${proteinLogged}g de proteína. Te sugerimos sumar pechuga de pollo, lomo de atún, claras de huevo o tofu en tu siguiente comida.`,
      icon: Info,
      color: 'border-secondary/50 bg-secondary/5 text-secondary'
    });
  }

  // 3. Hydration check
  if (waterGlasses < 4) {
    alerts.push({
      type: 'hydration',
      title: 'Falta de Hidratación',
      desc: 'Has registrado poca agua hoy. Mantenerse hidratado optimiza tu digestión y metabolismo basal.',
      icon: Droplet,
      color: 'border-blue-400 bg-blue-500/5 text-blue-600'
    });
  } else if (waterGlasses >= 8) {
    alerts.push({
      type: 'success',
      title: 'Meta de Hidratación Alcanzada',
      desc: '¡Excelente! Has alcanzado los 2 Litros de agua diarios recomendados.',
      icon: CheckCircle,
      color: 'border-primary/50 bg-primary-container/10 text-primary'
    });
  }

  // 4. Calorie goal check
  if (caloriesLogged > targetCalories) {
    alerts.push({
      type: 'warning',
      title: 'Límite Calórico Superado',
      desc: `Has superado tu meta de hoy por ${caloriesLogged - targetCalories} kcal. Mantén el ritmo en tus entrenamientos.`,
      icon: AlertTriangle,
      color: 'border-error/50 bg-error-container/5 text-error'
    });
  }

  // Add default welcome insight if list empty
  if (alerts.length === 0) {
    alerts.push({
      type: 'info',
      title: 'Sugerencia de NutriAI',
      desc: `Tu IMC está en rango ${imcCategory.toLowerCase()}. Para optimizar la longevidad, enfócate en añadir vegetales crucíferos a tu almuerzo.`,
      icon: Info,
      color: 'border-primary/30 bg-primary/5 text-primary'
    });
  }

  // Format Recharts Data (last 7 days caloric intake)
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const dayMeals = meals.filter(meal => new Date(meal.created_at).toDateString() === dateStr);
    const dayCal = dayMeals.reduce((acc, curr) => acc + curr.calories, 0);
    const weekdayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    
    last7DaysData.push({
      day: weekdayName,
      calorias: dayCal,
      meta: targetCalories
    });
  }

  // Health Score Calculation
  let healthScore = 95;
  if (waterGlasses < 4) healthScore -= 10;
  if (waterGlasses >= 8) healthScore += 5;
  if (caloriesLogged > targetCalories) healthScore -= 15;
  if (proteinLogged > 0 && proteinLogged < 30) healthScore -= 5;
  healthScore = Math.max(Math.min(healthScore, 100), 50);

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* IMC Card */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-tertiary dark:text-tertiary-fixed-dim font-semibold text-sm">IMC (Masa Corporal)</span>
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">monitor_weight</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold">{imc}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${imcColor}`}>
              {imcCategory}
            </span>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-tertiary dark:text-tertiary-fixed-dim font-semibold text-sm">Consumo de Calorías</span>
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Flame className="text-secondary" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold">{caloriesLogged.toLocaleString()}</h3>
            <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim mt-1">Meta: {targetCalories} kcal</p>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-tertiary dark:text-tertiary-fixed-dim font-semibold text-sm">Health Score</span>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Heart className="text-primary fill-primary/30" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold">{healthScore}<span className="text-sm font-normal opacity-50">/100</span></h3>
            <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Weight Tracker Card */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-tertiary dark:text-tertiary-fixed-dim font-semibold text-sm">Peso Actual</span>
            <div className="p-2 bg-tertiary/10 rounded-lg">
              <Flag className="text-tertiary" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold">{weight} <span className="text-sm font-normal">kg</span></h3>
            <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim mt-1">Objetivo: {targetWeight} kg</p>
          </div>
        </div>
      </section>

      {/* Main Charts & Insights Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Trend Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold">Historial Calórico</h3>
              <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim">Últimos 7 días de consumo vs Meta diaria</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                Consumo
              </span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEFF" />
                <XAxis dataKey="day" stroke="#565e74" fontSize={12} tickLine={false} />
                <YAxis stroke="#565e74" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'rgba(255, 255, 255, 0.9)' 
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#0b1c30' }}
                />
                <Bar dataKey="calorias" fill="#006e2f" radius={[8, 8, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Alerts Section */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <span className="material-symbols-outlined fill-icon">smart_toy</span>
            </div>
            <h3 className="font-headline text-lg font-bold">Alertas Inteligentes</h3>
          </div>
          
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[260px] pr-1 custom-scrollbar">
            {alerts.map((alert, idx) => {
              const AlertIcon = alert.icon;
              return (
                <div key={idx} className={`p-4 rounded-xl border-l-4 border ${alert.color}`}>
                  <div className="flex items-start gap-3">
                    <AlertIcon className="flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-bold text-sm leading-tight text-on-surface dark:text-white">{alert.title}</p>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Macros & Hydration Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macros Breakdown */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h3 className="font-headline text-lg font-bold mb-6">Distribución de Macronutrientes</h3>
          <div className="space-y-6">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Proteínas</span>
                <span className="text-tertiary dark:text-tertiary-fixed-dim">{proteinLogged}g / {proteinGoal}g</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((proteinLogged / proteinGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Carbohidratos</span>
                <span className="text-tertiary dark:text-tertiary-fixed-dim">{carbsLogged}g / {Math.round(weight * 3)}g</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((carbsLogged / (weight * 3)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Grasas</span>
                <span className="text-tertiary dark:text-tertiary-fixed-dim">{fatsLogged}g / {Math.round(weight * 0.8)}g</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-tertiary h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((fatsLogged / (weight * 0.8)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Water Tracker */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-lg font-bold mb-2">Seguimiento de Hidratación</h3>
            <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim mb-6">Registra tu ingesta de agua hoy (vasos de 250ml)</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(8)].map((_, i) => (
                <Droplet 
                  key={i} 
                  className={`transition-all ${i < waterGlasses ? 'text-blue-500 fill-blue-500 scale-110' : 'text-slate-300'}`} 
                  size={28} 
                />
              ))}
            </div>
            <p className="text-xl font-bold text-center mb-6">
              {waterGlasses} / 8 <span className="text-sm font-normal text-tertiary dark:text-tertiary-fixed-dim">vasos ({waterGlasses * 250} ml)</span>
            </p>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={handleAddWater}
                className="flex-grow bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all active:scale-95 shadow-sm"
              >
                + Añadir Vaso
              </button>
              <button 
                onClick={handleResetWater}
                className="border border-outline-variant hover:bg-slate-50 dark:hover:bg-slate-900 text-tertiary dark:text-tertiary-fixed-dim py-2 px-3 rounded-xl text-xs transition-colors"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        {/* Recipe of the day */}
        <div className="bg-primary dark:bg-primary/90 text-on-primary p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Recomendación de Comida</span>
            <h4 className="font-headline text-xl font-bold mt-4 mb-2">Bowl Mediterráneo Vitalidad</h4>
            <p className="text-xs opacity-90 leading-relaxed">
              Ensalada fresca de garbanzos, salmón a la plancha, aguacate y pepino. Rociada con limón y chía. Ideal para tu recuperación muscular hoy.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs opacity-80 pt-6">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 15 min
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_fire_department</span> 450 kcal
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
