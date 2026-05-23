import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col justify-center items-center p-6 relative">
      {/* Back button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium">
        <ArrowLeft size={18} />
        Volver al inicio
      </Link>

      <div className="absolute top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 md:p-10 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-primary mb-2">NutriAI</h1>
          <p className="text-on-surface-variant text-sm">Ingresa a tu portal de nutrición preventiva</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container/30 border border-error/20 text-error rounded-2xl flex items-start gap-3 text-sm">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <KeyRound size={18} />
              </span>
              <input
                id="password"
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none text-on-surface"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-on-primary py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
          <p className="text-sm text-on-surface-variant">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
