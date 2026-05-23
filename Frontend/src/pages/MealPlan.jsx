import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Sparkles, Calendar, TrendingUp, Info, Utensils, RefreshCw, AlertCircle } from 'lucide-react';

const MealPlan = () => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [error, setError] = useState('');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/plans`);
      setPlanData(res.data.plan);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('No se pudo cargar el plan alimenticio. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewPlan = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await axios.post(`${API_URL}/plans/generate`);
      setPlanData(res.data.plan);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError('No se pudo generar un nuevo plan. Verifica si tu perfil está completo.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userGoals = planData?.userGoals;
  const weeklyPlan = planData?.weeklyPlan;
  const activePlanDay = weeklyPlan?.[activeDay];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-headline text-lg font-bold">Plan Alimenticio Inteligente</h3>
          <p className="text-xs text-on-surface-variant">Menú semanal personalizado de grado clínico generado por IA</p>
        </div>
        <button
          onClick={handleGenerateNewPlan}
          disabled={generating}
          className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Generando Plan...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generar Nuevo Plan con IA
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container/30 border border-error/20 text-error rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Target Goals Summary */}
      {userGoals && (
        <section className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-r border-outline-variant/20 pr-4">
            <p className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase tracking-wider">Objetivo de Salud</p>
            <p className="font-headline text-lg font-bold mt-1 text-primary">{userGoals.goalText}</p>
            <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-0.5">Preferencia: {userGoals.foodPreference}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase tracking-wider">Calorías Diarias</p>
            <p className="font-headline text-2xl font-bold mt-1">{userGoals.dailyCalories} kcal</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase tracking-wider">Macronutrientes Meta</p>
            <div className="flex gap-4 mt-2 text-xs font-bold">
              <span className="text-primary">P: {userGoals.macros?.proteins}</span>
              <span className="text-secondary">C: {userGoals.macros?.carbs}</span>
              <span className="text-tertiary">G: {userGoals.macros?.fats}</span>
            </div>
          </div>
          <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-2.5">
            <Info className="text-primary flex-shrink-0" size={18} />
            <p className="text-[11px] leading-relaxed text-on-surface-variant dark:text-tertiary-fixed-dim">
              Tu plan alimenticio preventivo se ha estructurado para mejorar tu salud cardiovascular, digestiva y muscular.
            </p>
          </div>
        </section>
      )}

      {/* Tab Navigation for Weekdays */}
      <div className="flex border-b border-outline-variant/30 overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`
              px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200
              ${activeDay === day 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant dark:text-tertiary-fixed-dim hover:bg-slate-100 dark:hover:bg-slate-900'
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day's Food Suggestions Grid */}
      {activePlanDay ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meal Options Details */}
          <div className="space-y-4">
            <h4 className="font-headline text-md font-bold text-on-surface border-l-4 border-primary pl-2.5">Menú del {activeDay}</h4>
            
            {/* Breakfast */}
            <div className="bg-white dark:bg-on-tertiary-fixed p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl">
                <Utensils size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-bold text-sm text-on-surface dark:text-white">Desayuno</h5>
                  <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-200 px-2.5 py-0.5 rounded-full">{activePlanDay.desayuno?.cal} kcal</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-2 leading-relaxed font-semibold">{activePlanDay.desayuno?.name}</p>
                <div className="flex gap-4 mt-3 text-[10px] text-on-surface-variant dark:text-tertiary-fixed-dim font-bold">
                  <span>P: {activePlanDay.desayuno?.prot}g</span>
                  <span>C: {activePlanDay.desayuno?.carbs}g</span>
                  <span>G: {activePlanDay.desayuno?.fats}g</span>
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-white dark:bg-on-tertiary-fixed p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-xl">
                <Utensils size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-bold text-sm text-on-surface dark:text-white">Almuerzo / Comida</h5>
                  <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-200 px-2.5 py-0.5 rounded-full">{activePlanDay.almuerzo?.cal} kcal</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-2 leading-relaxed font-semibold">{activePlanDay.almuerzo?.name}</p>
                <div className="flex gap-4 mt-3 text-[10px] text-on-surface-variant dark:text-tertiary-fixed-dim font-bold">
                  <span>P: {activePlanDay.almuerzo?.prot}g</span>
                  <span>C: {activePlanDay.almuerzo?.carbs}g</span>
                  <span>G: {activePlanDay.almuerzo?.fats}g</span>
                </div>
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-white dark:bg-on-tertiary-fixed p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-xl">
                <Utensils size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-bold text-sm text-on-surface dark:text-white">Cena</h5>
                  <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-200 px-2.5 py-0.5 rounded-full">{activePlanDay.cena?.cal} kcal</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-2 leading-relaxed font-semibold">{activePlanDay.cena?.name}</p>
                <div className="flex gap-4 mt-3 text-[10px] text-on-surface-variant dark:text-tertiary-fixed-dim font-bold">
                  <span>P: {activePlanDay.cena?.prot}g</span>
                  <span>C: {activePlanDay.cena?.carbs}g</span>
                  <span>G: {activePlanDay.cena?.fats}g</span>
                </div>
              </div>
            </div>

            {/* Snack */}
            <div className="bg-white dark:bg-on-tertiary-fixed p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-xl">
                <Utensils size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-bold text-sm text-on-surface dark:text-white">Snack / Colación</h5>
                  <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-200 px-2.5 py-0.5 rounded-full">{activePlanDay.snack?.cal} kcal</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-2 leading-relaxed font-semibold">{activePlanDay.snack?.name}</p>
                <div className="flex gap-4 mt-3 text-[10px] text-on-surface-variant dark:text-tertiary-fixed-dim font-bold">
                  <span>P: {activePlanDay.snack?.prot}g</span>
                  <span>C: {activePlanDay.snack?.carbs}g</span>
                  <span>G: {activePlanDay.snack?.fats}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Summary Analytics */}
          <div className="space-y-6">
            <h4 className="font-headline text-md font-bold text-on-surface border-l-4 border-secondary pl-2.5">Métricas de Hoy ({activeDay})</h4>
            
            <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <div>
                <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim font-bold">Energía Total Proyectada</p>
                <p className="font-headline text-3xl font-extrabold text-primary mt-1">{activePlanDay.totals?.calories} kcal</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Proteína Proyectada</span>
                    <span className="text-on-surface-variant dark:text-tertiary-fixed-dim">{activePlanDay.totals?.proteins}g</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${Math.min((activePlanDay.totals?.proteins / (userGoals?.dailyCalories ? userGoals.dailyCalories * 0.05 : 100)) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Carbohidratos Proyectados</span>
                    <span className="text-on-surface-variant dark:text-tertiary-fixed-dim">{activePlanDay.totals?.carbs}g</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: `${Math.min((activePlanDay.totals?.carbs / (userGoals?.dailyCalories ? userGoals.dailyCalories * 0.1 : 200)) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Grasas Proyectadas</span>
                    <span className="text-on-surface-variant dark:text-tertiary-fixed-dim">{activePlanDay.totals?.fats}g</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full" style={{ width: `${Math.min((activePlanDay.totals?.fats / (userGoals?.dailyCalories ? userGoals.dailyCalories * 0.03 : 60)) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4 text-xs text-on-surface-variant dark:text-tertiary-fixed-dim space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Garantiza el 100% de micronutrientes diarios.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Equilibrado en grasas monoinsaturadas cardiosaludables.
                </p>
              </div>
            </div>

            {/* Food recommendations based on preventives */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-start gap-4">
              <span className="p-2.5 bg-white/10 rounded-xl text-primary-container">
                <Sparkles size={20} />
              </span>
              <div>
                <h5 className="font-headline font-bold text-sm mb-1.5">Diagnóstico IA Preventivo</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "El menú de hoy incluye antioxidantes claves provenientes de frutos rojos y omega-3 del pescado, previniendo el estrés oxidativo celular."
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-on-surface-variant">Generando plan nutricional...</div>
      )}
    </div>
  );
};

export default MealPlan;
