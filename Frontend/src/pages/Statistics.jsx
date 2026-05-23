import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Scale, Percent } from 'lucide-react';

const Statistics = () => {
  const [meals, setMeals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(`${API_URL}/user/profile`);
      setProfile(userRes.data);
      const mealsRes = await axios.get(`${API_URL}/meals`);
      setMeals(mealsRes.data);
    } catch (err) {
      console.error('Error loading stats data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate targets based on BMR
  const weight = parseFloat(profile?.weight) || 70;
  const height = parseFloat(profile?.height) || 170;
  const age = parseInt(profile?.age) || 30;
  const gender = profile?.gender || 'm';
  const activity = profile?.activity_level || 'moderado';

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
  const targetWeight = parseFloat(profile?.target_weight) || weight;

  if (targetWeight < weight - 1) {
    targetCalories = Math.max(targetCalories - 450, 1200);
  } else if (targetWeight > weight + 1) {
    targetCalories += 300;
  }

  // Process data for the last 7 days
  const last7DaysData = [];
  let totalCaloriesAllDays = 0;
  let totalProteinAllDays = 0;
  let totalCarbsAllDays = 0;
  let totalFatsAllDays = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    
    const dayMeals = meals.filter(meal => new Date(meal.created_at).toDateString() === dateStr);
    const dayCal = dayMeals.reduce((acc, curr) => acc + curr.calories, 0);
    const dayProt = dayMeals.reduce((acc, curr) => acc + curr.proteins, 0);
    const dayCarbs = dayMeals.reduce((acc, curr) => acc + curr.carbs, 0);
    const dayFats = dayMeals.reduce((acc, curr) => acc + curr.fats, 0);

    totalCaloriesAllDays += dayCal;
    totalProteinAllDays += dayProt;
    totalCarbsAllDays += dayCarbs;
    totalFatsAllDays += dayFats;

    const weekdayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    last7DaysData.push({
      name: weekdayName,
      calorias: dayCal,
      proteinas: dayProt,
      carbohidratos: dayCarbs,
      grasas: dayFats,
      meta: targetCalories
    });
  }

  const avgCalories = Math.round(totalCaloriesAllDays / 7);
  const avgProtein = Math.round(totalProteinAllDays / 7);
  const avgCarbs = Math.round(totalCarbsAllDays / 7);
  const avgFats = Math.round(totalFatsAllDays / 7);

  return (
    <div className="space-y-8">
      {/* Overview stats cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-primary/10 rounded-xl text-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-green-400 dark:text-tertiary-fixed-dim">Promedio Calórico Semanal</p>
            <h4 className="font-headline text-2xl font-bold mt-1">{avgCalories} kcal / día</h4>
            <p className="text-[10px] text-green-400 dark:text-tertiary-fixed-dim mt-0.5">Meta establecida: {targetCalories} kcal</p>
          </div>
        </div>

        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-secondary/10 rounded-xl text-secondary">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-green-400 dark:text-tertiary-fixed-dim">Relación Peso / Meta</p>
            <h4 className="font-headline text-2xl font-bold mt-1">{weight} kg</h4>
            <p className="text-[10px] text-green-400 dark:text-tertiary-fixed-dim mt-0.5">Objetivo preventivo: {targetWeight} kg</p>
          </div>
        </div>

        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-tertiary/10 rounded-xl text-tertiary">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-green-400 dark:text-tertiary-fixed-dim">Promedio de Macronutrientes</p>
            <p className="text-xs font-bold mt-1 flex gap-3">
              <span className="text-primary">P: {avgProtein}g</span>
              <span className="text-secondary">C: {avgCarbs}g</span>
              <span className="text-tertiary">G: {avgFats}g</span>
            </p>
          </div>
        </div>
      </section>

      {/* Recharts Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Area Chart */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="mb-6">
            <h4 className="font-headline text-md font-bold text-on-surface">Curva de Ingesta Calórica</h4>
            <p className="text-xs text-green-400 dark:text-tertiary-fixed-dim">Historial de energía absorbida comparada con el límite metabólico</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006e2f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#006e2f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEFF" />
                <XAxis dataKey="name" stroke="#565e74" fontSize={11} tickLine={false} />
                <YAxis stroke="#565e74" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="calorias" name="Calorías Logueadas" stroke="#006e2f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCal)" />
                <Area type="monotone" dataKey="meta" name="Meta Diaria" stroke="#ba1a1a" strokeDasharray="5 5" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Macronutrients Bar Chart */}
        <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="mb-6">
            <h4 className="font-headline text-md font-bold text-on-surface">Historial de Macronutrientes</h4>
            <p className="text-xs text-green-400 dark:text-tertiary-fixed-dim">Distribución diaria de Proteínas, Carbohidratos y Grasas (g)</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEFF" />
                <XAxis dataKey="name" stroke="#565e74" fontSize={11} tickLine={false} />
                <YAxis stroke="#565e74" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="proteinas" name="Proteínas" stackId="a" fill="#006e2f" />
                <Bar dataKey="carbohidratos" name="Carbs" stackId="a" fill="#0058be" />
                <Bar dataKey="grasas" name="Grasas" stackId="a" fill="#565e74" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Prevention Insights */}
      <section className="bg-gradient-to-r from-primary to-emerald-800 text-on-primary p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-headline text-lg font-bold flex items-center gap-2">
            <Sparkles size={18} /> Balance de Rendimiento Preventivo
          </h4>
          <p className="text-xs opacity-90 mt-2 max-w-xl leading-relaxed">
            Tu relación de macronutrientes promedio esta semana es de {Math.round((avgProtein * 4 / (avgCalories || 1)) * 100)}% proteínas, {Math.round((avgCarbs * 4 / (avgCalories || 1)) * 100)}% carbohidratos, y {Math.round((avgFats * 9 / (avgCalories || 1)) * 100)}% grasas. Esta distribución es recomendada para la homeostasis energética celular y mitocondrial.
          </p>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
          <p className="text-[10px] uppercase tracking-wider font-bold">Health Score Promedio</p>
          <p className="font-headline text-3xl font-extrabold text-white mt-1">94%</p>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
