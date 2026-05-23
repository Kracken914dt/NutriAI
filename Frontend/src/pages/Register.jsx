import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Mail, KeyRound, ArrowLeft, Ruler, Weight, HelpCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'm',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError('Nombre, Correo y Contraseña son campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col justify-center items-center p-6 relative">
      {/* Back button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-tertiary dark:text-white hover:text-primary transition-colors font-medium">
        <ArrowLeft size={18} />
        Volver al inicio
      </Link>

      <div className="absolute top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl glass-card rounded-3xl p-8 md:p-10 shadow-xl relative z-10 my-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-primary mb-2">NutriAI</h1>
          <p className="text-tertiary dark:text-white text-sm">Crea tu perfil clínico y comienza a optimizar tu salud</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container/30 border border-error/20 text-error rounded-2xl flex items-start gap-3 text-sm">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-outline-variant/20 pb-2">Información Básica</h3>
              
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="name">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                    <User size={16} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="email">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    placeholder="juan@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="password">
                  Contraseña *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                    <KeyRound size={16} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Health Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-outline-variant/20 pb-2">Información Física</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="age">
                    Edad
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                      <HelpCircle size={16} />
                    </span>
                    <input
                      id="age"
                      type="number"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                      placeholder="30"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="gender">
                    Género
                  </label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="m">Masculino</option>
                    <option value="f">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="weight">
                  Peso Actual (kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                    <Weight size={16} />
                  </span>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    placeholder="75.5"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="height">
                  Estatura (cm)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary dark:text-white">
                    <Ruler size={16} />
                  </span>
                  <input
                    id="height"
                    type="number"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface text-sm"
                    placeholder="175"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-on-primary py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creando cuenta...' : 'Comenzar mi Evaluación'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
          <p className="text-sm text-tertiary dark:text-white">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
