import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { User, Weight, Ruler, Activity, Award, Heart, HelpCircle, Save, Edit2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'm',
    activity_level: 'moderado',
    target_weight: '',
    food_preference: 'ninguna'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/user/profile`);
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        age: res.data.age || '',
        weight: res.data.weight || '',
        height: res.data.height || '',
        gender: res.data.gender || 'm',
        activity_level: res.data.activity_level || 'moderado',
        target_weight: res.data.target_weight || '',
        food_preference: res.data.food_preference || 'ninguna'
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('No se pudo cargar la información del perfil.');
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put(`${API_URL}/user/profile`, {
        name: formData.name,
        age: parseInt(formData.age) || null,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        gender: formData.gender,
        activity_level: formData.activity_level,
        target_weight: parseFloat(formData.target_weight) || null,
        food_preference: formData.food_preference
      });
      setProfile(res.data);
      setIsEditing(false);
      setSuccess('Perfil actualizado correctamente. Tu plan alimenticio se adaptará a estos cambios.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('No se pudieron guardar los cambios en el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Derived metrics
  const w = parseFloat(profile?.weight) || 70;
  const h = parseFloat(profile?.height) || 170;
  const bmi = h > 0 ? (w / Math.pow(h / 100, 2)).toFixed(1) : '24.2';
  
  let bmiCategory = 'Normal';
  let bmiDesc = 'Tu índice de masa corporal está en el rango ideal. Continúa con tus hábitos preventivos.';
  const bVal = parseFloat(bmi);
  if (bVal < 18.5) {
    bmiCategory = 'Bajo peso';
    bmiDesc = 'Estás por debajo del rango saludable. Te sugerimos incrementar calorías de calidad.';
  } else if (bVal >= 25 && bVal < 29.9) {
    bmiCategory = 'Sobrepeso';
    bmiDesc = 'Tienes sobrepeso leve. Un déficit calórico moderado te ayudará a recuperar tu peso ideal.';
  } else if (bVal >= 30) {
    bmiCategory = 'Obesidad';
    bmiDesc = 'Tu IMC indica obesidad. Consulta a un especialista médico e inicia cambios alimenticios.';
  }

  return (
    <div className="space-y-8">
      {/* Title & Edit Toggle */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-headline text-lg font-bold">Perfil Nutricional</h3>
          <p className="text-xs text-tertiary dark:text-white">Configura tus variables fisiológicas básicas</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Edit2 size={16} />
            Editar Perfil
          </button>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-error-container/30 border border-error/20 text-error rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-primary-container/20 border border-primary/20 text-primary rounded-xl flex items-start gap-3 text-sm">
          <Save className="flex-shrink-0 mt-0.5" size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Grid: Info Cards or Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & BMI Diagnoses */}
        <section className="lg:col-span-1 space-y-6">
          {/* Main User Card */}
          <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm text-center">
            <img
              alt="User Headshot"
              className="w-24 h-24 rounded-full border-4 border-primary-container object-cover mx-auto mb-4"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
            />
            <h4 className="font-headline text-lg font-bold">{profile?.name}</h4>
            <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim uppercase font-bold tracking-wider mt-1">{profile?.email}</p>
            <div className="mt-6 pt-6 border-t border-outline-variant/20 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] text-tertiary dark:text-tertiary-fixed-dim uppercase font-bold">Actividad</p>
                <p className="text-sm font-semibold capitalize mt-1">{profile?.activity_level}</p>
              </div>
              <div>
                <p className="text-[10px] text-tertiary dark:text-tertiary-fixed-dim uppercase font-bold">Dieta</p>
                <p className="text-sm font-semibold capitalize mt-1">{profile?.food_preference}</p>
              </div>
            </div>
          </div>

          {/* BMI Info box */}
          <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <Heart size={20} className="fill-primary/20" />
            </div>
            <div>
              <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim font-bold">Diagnóstico de Peso (IMC)</p>
              <h5 className="font-headline text-lg font-bold mt-1">{bmi} <span className="text-xs text-primary font-bold">({bmiCategory})</span></h5>
              <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim mt-2 leading-relaxed">{bmiDesc}</p>
            </div>
          </div>
        </section>

        {/* Profile details form / list */}
        <section className="lg:col-span-2">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-md space-y-6">
              <h4 className="font-headline text-md font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <Save size={18} /> Modificar Parámetros de Salud
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="name">
                    Nombre Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="age">
                    Edad (años)
                  </label>
                  <input
                    id="age"
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="weight">
                    Peso Actual (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="height">
                    Estatura (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="gender">
                    Género Fisiológico
                  </label>
                  <select
                    id="gender"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="m">Masculino</option>
                    <option value="f">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="activity_level">
                    Nivel de Actividad Física
                  </label>
                  <select
                    id="activity_level"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.activity_level}
                    onChange={handleChange}
                  >
                    <option value="sedentario">Sedentario (Oficina / Reposo)</option>
                    <option value="ligero">Ligero (1-3 días de cardio)</option>
                    <option value="moderado">Moderado (3-5 días activos)</option>
                    <option value="activo">Activo (Entrenamiento diario)</option>
                    <option value="muy activo">Muy Activo (Doble sesión / Atleta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="target_weight">
                    Peso Objetivo (kg)
                  </label>
                  <input
                    id="target_weight"
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.target_weight}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-on-surface dark:text-white" htmlFor="food_preference">
                    Preferencia / Enfoque Dietario
                  </label>
                  <select
                    id="food_preference"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface dark:text-black"
                    value={formData.food_preference}
                    onChange={handleChange}
                  >
                    <option value="ninguna">Sin restricciones (Omnívora)</option>
                    <option value="vegetariano">Vegetariana</option>
                    <option value="vegano">Vegana</option>
                    <option value="keto">Keto (Cetogénica / Baja en Carbs)</option>
                    <option value="paleo">Paleo (Alimentos naturales)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end border-t border-outline-variant/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-outline-variant hover:bg-slate-50 dark:hover:bg-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/95 text-on-primary font-bold px-8 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Parámetros'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <h4 className="font-headline text-md font-bold text-on-surface dark:text-white border-b border-outline-variant/20 pb-3">Detalle Clínico</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <User size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Nombre</p>
                    <p className="font-semibold mt-0.5">{profile?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <HelpCircle size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Edad</p>
                    <p className="font-semibold mt-0.5">{profile?.age} años</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <Weight size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Peso Actual</p>
                    <p className="font-semibold mt-0.5">{profile?.weight} kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <Ruler size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Estatura</p>
                    <p className="font-semibold mt-0.5">{profile?.height} cm</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <Activity size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Nivel de Actividad</p>
                    <p className="font-semibold capitalize mt-0.5">{profile?.activity_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-tertiary-fixed-dim rounded-lg">
                    <Award size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-tertiary dark:text-tertiary-fixed-dim">Peso Objetivo</p>
                    <p className="font-semibold mt-0.5">{profile?.target_weight || profile?.weight} kg</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
