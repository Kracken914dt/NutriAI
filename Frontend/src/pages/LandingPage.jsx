import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Cpu, TrendingUp, Compass, Heart, Award } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white/40 backdrop-blur-md sticky top-0 z-50 border-b border-primary-container/40 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1440px] mx-auto h-20">
          <div className="flex items-center gap-8">
            <span className="font-headline text-2xl font-extrabold text-primary">NutriAI</span>
            <nav className="hidden md:flex gap-6">
              <a className="font-medium text-primary border-b-2 border-primary pb-1" href="#inicio">Inicio</a>
              <a className="font-medium text-secondary hover:text-primary transition-colors" href="#funciones">Funciones</a>
              <a className="font-medium text-secondary hover:text-primary transition-colors" href="#beneficios">Ciencia</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-medium text-secondary hover:text-primary transition-all duration-200 active:scale-95">Login</Link>
            <Link to="/register" className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md">Registro</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="inicio" className="relative pt-12 pb-24 overflow-hidden px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                Impulsado por Inteligencia Artificial
              </span>
              <h1 className="font-headline text-4xl md:text-6xl text-on-surface mb-6 tracking-tight leading-tight font-bold">
                Tu asistente inteligente de <span className="text-primary">nutrición preventiva</span>
              </h1>
              <p className="text-lg text-green-400 mb-10 max-w-xl leading-relaxed">
                Optimiza tu salud con análisis metabólicos y planes personalizados generados por IA. NutriAI traduce datos médicos y nutricionales complejos en acciones diarias para tu longevidad.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/95 text-on-primary px-8 py-4 rounded-full font-bold transition-all duration-200 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  Comenzar ahora
                  <ArrowRight size={18} />
                </button>
                <a 
                  href="#funciones" 
                  className="bg-surface-container-low text-secondary px-8 py-4 rounded-full font-bold transition-all duration-200 active:scale-95 flex items-center justify-center border border-outline-variant/30"
                >
                  Ver Funciones
                </a>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-12 -right-12 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl"></div>
              <div className="glass-card p-4 rounded-3xl relative">
                <img 
                  alt="AI Medical Interface" 
                  className="rounded-2xl w-full h-[400px] object-cover" 
                  src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800"
                />
                {/* Floating Glass Widget */}
                <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl hidden md:block max-w-[240px]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Activity size={18} />
                    </span>
                    <span className="font-bold text-sm">Salud Metabólica</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mb-2">
                    <div className="bg-primary h-full w-[85%] rounded-full"></div>
                  </div>
                  <p className="text-xs text-green-400 font-medium">+15% mejora esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="funciones" className="py-16 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-4 font-bold">Funciones de precisión</h2>
            <p className="text-green-400 max-w-2xl mx-auto">
              Tecnología de grado clínico diseñada para ser intuitiva, personalizada y adaptable a tus necesidades reales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 glass-card p-8 md:p-10 rounded-[32px] flex flex-col justify-between overflow-hidden relative group">
              <div className="z-10">
                <span className="p-3 bg-primary/10 rounded-2xl text-primary inline-block mb-6">
                  <TrendingUp size={24} />
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">Análisis nutricional profundo</h3>
                <p className="text-green-400 max-w-sm">
                  Evaluamos tus requerimientos calóricos e índice de masa corporal para entender exactamente lo que necesita tu cuerpo.
                </p>
              </div>
              <div className="mt-8 transform group-hover:scale-105 transition-transform duration-500 rounded-xl overflow-hidden shadow-md">
                <img 
                  alt="Data Analytics" 
                  className="w-full h-48 object-cover" 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                />
              </div>
            </div>

            {/* Vertical Feature */}
            <div className="bg-primary text-on-primary p-8 md:p-10 rounded-[32px] flex flex-col justify-between shadow-lg">
              <div>
                <span className="p-3 bg-white/20 rounded-2xl inline-block mb-6">
                  <Cpu size={24} />
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">Recomendaciones IA</h3>
                <p className="text-on-primary/80 leading-relaxed">
                  Algoritmos inteligentes y adaptables que ajustan tus objetivos calóricos basándose en tus comidas y nivel de actividad.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-white/20">
                <Link to="/register" className="font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform">
                  Saber más <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="glass-card p-8 rounded-[32px] flex flex-col justify-between">
              <div>
                <span className="p-3 bg-secondary/10 rounded-2xl text-secondary inline-block mb-6">
                  <Compass size={24} />
                </span>
                <h3 className="font-headline text-xl font-bold mb-2">Asistente IA Interactivo</h3>
                <p className="text-green-400">
                  Resuelve tus dudas nutricionales en tiempo real con un chat clínico inteligente y profesional.
                </p>
              </div>
            </div>

            {/* Small Feature 2 */}
            <div className="glass-card p-8 rounded-[32px] md:col-span-2 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="p-3 bg-tertiary/10 rounded-2xl text-tertiary inline-block mb-6">
                  <Award size={24} />
                </span>
                <h3 className="font-headline text-xl font-bold mb-2">Planes alimenticios inteligentes</h3>
                <p className="text-green-400">
                  Planificación automática de menús semanales de comida con desglose total de calorías, carbohidratos, proteínas y grasas.
                </p>
              </div>
              <div className="w-full sm:w-1/3 rounded-2xl overflow-hidden shadow-sm">
                <img 
                  alt="Healthy Food" 
                  className="h-32 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Banner */}
        <section className="bg-on-tertiary-fixed text-on-tertiary py-20 px-6 md:px-12">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="font-headline text-5xl font-extrabold text-primary-container mb-2">50k+</div>
              <div className="text-sm font-semibold uppercase tracking-widest opacity-60">Usuarios Activos</div>
            </div>
            <div>
              <div className="font-headline text-5xl font-extrabold text-primary-container mb-2">1.2M</div>
              <div className="text-sm font-semibold uppercase tracking-widest opacity-60">Planes Generados</div>
            </div>
            <div>
              <div className="font-headline text-5xl font-extrabold text-primary-container mb-2">94%</div>
              <div className="text-sm font-semibold uppercase tracking-widest opacity-60">Mejoras de Salud</div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="beneficios" className="py-16 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-4 font-bold">Lo que dicen los expertos</h2>
            <p className="text-green-400 max-w-xl mx-auto">Nutrición basada en ciencia y respaldada por profesionales.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 md:p-10 rounded-[32px]">
              <div className="flex gap-1 text-yellow-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-icon text-2xl">star</span>
                ))}
              </div>
              <p className="text-lg text-on-surface mb-8 italic">
                "La precisión de los análisis de NutriAI es comparable a una consulta clínica de alto nivel. Ha transformado la forma en que mis pacientes gestionan su alimentación."
              </p>
              <div className="flex items-center gap-4">
                <img 
                  alt="Dra. Elena R." 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-container"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                />
                <div>
                  <p className="font-bold text-sm text-on-surface">Dra. Elena Rodríguez</p>
                  <p className="text-xs text-green-400">Especialista en Endocrinología</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-[32px]">
              <div className="flex gap-1 text-yellow-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-icon text-2xl">star</span>
                ))}
              </div>
              <p className="text-lg text-on-surface mb-8 italic">
                "NutriAI elimina las conjeturas de la nutrición. La IA entiende mis objetivos de rendimiento atlético mejor que cualquier aplicación que haya usado antes."
              </p>
              <div className="flex items-center gap-4">
                <img 
                  alt="Marco S." 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-container"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                />
                <div>
                  <p className="font-bold text-sm text-on-surface">Marco Sandoval</p>
                  <p className="text-xs text-green-400">Triatleta Profesional</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-6 max-w-[1440px] mx-auto">
          <div className="bg-primary rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="font-headline text-3xl md:text-5xl text-on-primary mb-6 font-bold">¿Listo para hackear tu longevidad?</h2>
              <p className="text-on-primary/80 text-lg mb-10 max-w-2xl mx-auto">
                Únete a miles de personas que ya están optimizando su salud cardiovascular y metabólica con inteligencia artificial.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-primary px-10 py-5 rounded-full font-bold transition-all duration-200 active:scale-95 shadow-xl hover:bg-surface-container-low"
              >
                Empezar Prueba Gratuita
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-on-tertiary-fixed dark:bg-surface-container-lowest text-on-tertiary dark:text-on-surface w-full py-16 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="md:col-span-1">
            <span className="font-headline text-2xl font-extrabold text-primary mb-6 block">NutriAI</span>
            <p className="opacity-70 text-xs leading-relaxed max-w-sm">
              © 2026 NutriAI. Precision Nutrition for Longevity. Tecnología avanzada para una vida más saludable y libre de enfermedades crónicas.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-white dark:text-on-surface">Producto</h4>
            <ul className="flex flex-col gap-4 text-xs opacity-80">
              <li><a className="hover:text-primary-container transition-colors" href="#funciones">Funciones</a></li>
              <li><a className="hover:text-primary-container transition-colors" href="#beneficios">Ciencia</a></li>
              <li><Link className="hover:text-primary-container transition-colors" to="/register">Planes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-white dark:text-on-surface">Compañía</h4>
            <ul className="flex flex-col gap-4 text-xs opacity-80">
              <li><a className="hover:text-primary-container transition-colors" href="#">Política de Privacidad</a></li>
              <li><a className="hover:text-primary-container transition-colors" href="#">Términos de Servicio</a></li>
              <li><a className="hover:text-primary-container transition-colors" href="#">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-white dark:text-on-surface">Legal</h4>
            <ul className="flex flex-col gap-4 text-xs opacity-80">
              <li><a className="hover:text-primary-container transition-colors" href="#">Documentación API</a></li>
              <li><a className="hover:text-primary-container transition-colors" href="#">Soporte Médico</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
