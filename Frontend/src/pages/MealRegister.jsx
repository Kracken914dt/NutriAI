import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Plus, Trash2, Calendar, ClipboardList, Utensils, PieChart, Info, ShieldAlert } from 'lucide-react';

const MealRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [meals, setMeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'desayuno',
    name: '',
    calories: '',
    proteins: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    fetchMeals();
    // Open form automatically if query search ?add=true is present
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('add') === 'true') {
      setShowAddForm(true);
      // clean search params
      navigate('/meals', { replace: true });
    }
  }, [location]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/meals`);
      setMeals(res.data);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('No se pudieron obtener las comidas registradas.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.calories) {
      setError('El nombre del alimento y las calorías son campos obligatorios.');
      return;
    }

    try {
      const mealToSubmit = {
        type: formData.type,
        name: formData.name,
        calories: parseInt(formData.calories) || 0,
        proteins: parseInt(formData.proteins) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fats: parseInt(formData.fats) || 0
      };

      const res = await axios.post(`${API_URL}/meals`, mealToSubmit);
      setMeals([res.data, ...meals]);
      setSuccess('Comida registrada correctamente.');
      setShowAddForm(false);
      
      // Reset form
      setFormData({
        type: 'desayuno',
        name: '',
        calories: '',
        proteins: '',
        carbs: '',
        fats: ''
      });
      
      // Clear success alert after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error logging meal:', err);
      setError(err.response?.data?.error || 'No se pudo guardar el registro del alimento.');
    }
  };

  // Group meals of today
  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(meal => new Date(meal.created_at).toDateString() === todayStr);

  const dailyTotals = todayMeals.reduce((acc, curr) => {
    acc.calories += curr.calories;
    acc.proteins += curr.proteins;
    acc.carbs += curr.carbs;
    acc.fats += curr.fats;
    return acc;
  }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

  return (
    <div className="space-y-8">
      {/* Title & Toggle Button */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-headline text-lg font-bold">Registro de Alimentos Diarios</h3>
          <p className="text-xs text-on-surface-variant">Lleva la cuenta de tus comidas para el diagnóstico preventivo</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={16} />
          {showAddForm ? 'Cerrar Panel' : 'Registrar Nuevo Alimento'}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-error-container/30 border border-error/20 text-error rounded-xl flex items-start gap-3 text-sm">
          <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-primary-container/20 border border-primary/20 text-primary rounded-xl flex items-start gap-3 text-sm">
          <ClipboardList className="flex-shrink-0 mt-0.5" size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Form Log Meal Section */}
      {showAddForm && (
        <section className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-md">
          <h4 className="font-headline text-md font-bold mb-4 flex items-center gap-2 text-primary">
            <Utensils size={18} /> Detalle de la Comida
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="type">
                Momento de la Comida
              </label>
              <select
                id="type"
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="cena">Cena</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="name">
                Nombre del Alimento / Receta *
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                placeholder="Ej. Batido de Proteína, Ensalada de Quinoa con Pollo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="calories">
                Calorías (kcal) *
              </label>
              <input
                id="calories"
                type="number"
                required
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                placeholder="350"
                value={formData.calories}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="proteins">
                Proteínas (g)
              </label>
              <input
                id="proteins"
                type="number"
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                placeholder="25"
                value={formData.proteins}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="carbs">
                Carbohidratos (g)
              </label>
              <input
                id="carbs"
                type="number"
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                placeholder="40"
                value={formData.carbs}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface" htmlFor="fats">
                Grasas (g)
              </label>
              <input
                id="fats"
                type="number"
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-sm"
                placeholder="10"
                value={formData.fats}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-8 py-3 rounded-xl text-sm transition-all active:scale-95 shadow-md"
              >
                Guardar Alimento
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Daily Nutrients Summary */}
      <section className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <h4 className="font-headline text-md font-bold mb-6 flex items-center gap-2 text-secondary">
          <PieChart size={18} /> Consumo Acumulado de Hoy
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Calorías</p>
            <p className="font-headline text-2xl font-bold mt-1 text-primary">{dailyTotals.calories} kcal</p>
          </div>
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Proteínas</p>
            <p className="font-headline text-2xl font-bold mt-1 text-secondary">{dailyTotals.proteins} g</p>
          </div>
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Carbohidratos</p>
            <p className="font-headline text-2xl font-bold mt-1 text-tertiary">{dailyTotals.carbs} g</p>
          </div>
          <div className="bg-surface-container-low dark:bg-surface-container-lowest p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Grasas</p>
            <p className="font-headline text-2xl font-bold mt-1 text-red-500">{dailyTotals.fats} g</p>
          </div>
        </div>
      </section>

      {/* Meals Table List */}
      <section className="bg-white dark:bg-on-tertiary-fixed rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex items-center gap-2">
          <Calendar size={18} className="text-slate-400" />
          <h4 className="font-headline text-md font-bold">Historial de Comidas</h4>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">Cargando alimentos registrados...</div>
        ) : meals.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
            <Info size={32} className="opacity-40" />
            <p className="font-semibold text-sm">No has registrado ninguna comida todavía.</p>
            <p className="text-xs">Usa el botón de arriba para registrar tu primer alimento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-surface-container-lowest text-on-surface-variant dark:text-white uppercase font-bold text-[10px] tracking-wider border-b border-outline-variant/20">
                  <th className="py-4 px-6">Momento</th>
                  <th className="py-4 px-6">Alimento</th>
                  <th className="py-4 px-6 text-right">Calorías</th>
                  <th className="py-4 px-6 text-right font-semibold text-primary">Proteína</th>
                  <th className="py-4 px-6 text-right font-semibold text-secondary">Carbs</th>
                  <th className="py-4 px-6 text-right font-semibold text-red-500">Grasas</th>
                  <th className="py-4 px-6 text-center">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {meals.map((meal) => {
                  const mealDate = new Date(meal.created_at);
                  const isToday = mealDate.toDateString() === todayStr;
                  return (
                    <tr key={meal.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <td className="py-4 px-6 capitalize">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          meal.type === 'desayuno' ? 'bg-amber-100 text-amber-800' :
                          meal.type === 'almuerzo' ? 'bg-emerald-100 text-emerald-800' :
                          meal.type === 'cena' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {meal.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-on-surface dark:text-white">{meal.name}</td>
                      <td className="py-4 px-6 text-right font-bold">{meal.calories} kcal</td>
                      <td className="py-4 px-6 text-right text-primary font-bold">{meal.proteins} g</td>
                      <td className="py-4 px-6 text-right text-secondary font-bold">{meal.carbs} g</td>
                      <td className="py-4 px-6 text-right text-red-500 font-bold">{meal.fats} g</td>
                      <td className="py-4 px-6 text-center text-xs text-on-surface-variant dark:text-tertiary-fixed-dim">
                        {isToday ? 'Hoy, ' : ''}
                        {mealDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default MealRegister;
