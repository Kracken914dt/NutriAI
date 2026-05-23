import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Settings, Moon, Sun, Download, Trash2, ShieldAlert, Sparkles, Check } from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('nutriai_dark_mode') === 'true';
  });
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutriai_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutriai_dark_mode', 'false');
    }
  }, [darkMode]);

  const themeLabel = darkMode ? 'Oscuro' : 'Claro';

  const handleExportData = async () => {
    try {
      setExporting(true);
      setError('');
      
      const profileRes = await axios.get(`${API_URL}/user/profile`);
      const mealsRes = await axios.get(`${API_URL}/meals`);
      
      const dataBackup = {
        exportedAt: new Date().toISOString(),
        profile: profileRes.data,
        meals: mealsRes.data
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataBackup, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `nutriai_backup_${profileRes.data.name.replace(/\s+/g, '_').toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccess('Tus datos de salud han sido exportados correctamente.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('No se pudieron recuperar tus datos de salud para exportar.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-headline text-lg font-bold">Configuración de NutriAI</h3>
        <p className="text-xs text-tertiary dark:text-white">Ajusta las preferencias de visualización y gestiona tus datos clínicos</p>
      </div>

      {success && (
        <div className="p-4 bg-primary-container/20 border border-primary/20 text-primary rounded-xl flex items-start gap-3 text-sm">
          <Check className="flex-shrink-0 mt-0.5" size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-container/30 border border-error/20 text-error rounded-xl flex items-start gap-3 text-sm">
          <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customizations Section */}
        <section className="lg:col-span-2 space-y-6">
          {/* Visual Preferences */}
          <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-headline text-md font-bold flex items-center gap-2 text-primary border-b border-outline-variant/20 pb-3">
              <Sun size={18} /> Preferencias Visuales
            </h4>
            
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-semibold">Modo {themeLabel}</p>
                <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim">Activa el modo claro o oscuro para toda la aplicación</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{themeLabel}</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  aria-pressed={darkMode}
                  className={`
                    w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                    ${darkMode ? 'bg-primary justify-end' : 'bg-slate-300 justify-start'}
                  `}
                >
                  <span className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600">
                    {darkMode ? <Moon size={12} className="text-primary" /> : <Sun size={12} />}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Backup Management */}
          <div className="bg-white dark:bg-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-headline text-md font-bold flex items-center gap-2 text-secondary border-b border-outline-variant/20 pb-3">
              <Download size={18} /> Gestión de Datos
            </h4>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-semibold">Exportar Reporte y Registros</p>
                <p className="text-xs text-tertiary dark:text-tertiary-fixed-dim">Descarga una copia completa de tu perfil y comidas en formato JSON</p>
              </div>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="bg-secondary hover:bg-secondary/95 text-on-secondary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Download size={14} />
                {exporting ? 'Exportando...' : 'Exportar Datos'}
              </button>
            </div>
          </div>
        </section>

        {/* Informative Clinical box */}
        <section className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2 text-primary-container">
              <Sparkles size={18} />
              <h4 className="font-headline font-bold text-sm">Privacidad NutriAI</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              NutriAI opera con encriptación local y respeta la confidencialidad médica. Ninguno de tus datos físicos o registros de alimentación es vendido a terceros. 
            </p>
            <p className="text-[10px] text-slate-400">
              Versión del software: NutriAI MVP v1.0.0 (Demostración Académica)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
