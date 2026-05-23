import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Send, Sparkles, User, HelpCircle, FileText, Activity, Droplet } from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hola, soy tu asistente de NutriAI de precisión. He analizado tu perfil de salud. ¿En qué puedo ayudarte a optimizar tu dieta o rendimiento hoy?',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    '¿Qué debo comer para bajar de peso?',
    '¿Cómo aumentar mi consumo de proteínas?',
    '¿Cómo puedo evitar los picos de azúcar?',
    '¿Estoy consumiendo las calorías recomendadas?'
  ];

  useEffect(() => {
    // Load profile summary for side widgets
    axios.get(`${API_URL}/user/profile`)
      .then(res => setUserProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setSending(true);

    try {
      const res = await axios.post(`${API_URL}/ai/chat`, { message: text });
      
      const aiMsg = {
        sender: 'ai',
        text: res.data.response,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        sender: 'ai',
        text: 'Lo siento, hubo un problema al conectar con el servidor de IA. Por favor, inténtalo de nuevo.',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] -mt-4 -mb-12 overflow-hidden">
      {/* Chat Window */}
      <section className="flex-grow flex flex-col glass-card rounded-2xl border border-outline-variant/30 overflow-hidden relative h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface dark:text-white leading-tight">Asistente Virtual NutriAI</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] uppercase font-bold text-tertiary dark:text-white">Online & Analizando Perfil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-36">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white
                ${msg.sender === 'user' ? 'bg-secondary' : 'bg-primary'}
              `}>
                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`
                p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.sender === 'user' 
                  ? 'bg-secondary text-on-secondary rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-white rounded-tl-none'
                }
              `}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <p className={`text-[10px] mt-2 opacity-65 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/20 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggestion Chips Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background dark:from-slate-950 via-background dark:via-slate-950/90 to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {suggestionChips.map((chip, i) => (
                <button
                  key={i}
                  disabled={sending}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-outline-variant/30 text-tertiary dark:text-white font-bold text-xs hover:bg-primary-container/20 hover:text-primary transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="relative glass-card rounded-2xl p-2 flex items-center shadow-lg border border-primary/20">
              <input
                type="text"
                disabled={sending}
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm px-4 text-on-surface dark:text-white placeholder:text-tertiary/50"
                placeholder="Escribe tu consulta nutricional aquí..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={sending || !inputText.trim()}
                className="ml-2 bg-primary hover:bg-primary/95 text-on-primary p-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar - Health Summary Info */}
      <aside className="hidden xl:flex flex-col w-[320px] glass-card border-l border-outline-variant/20 p-6 overflow-y-auto custom-scrollbar h-full justify-between">
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-md text-on-surface">Resumen Clínico</h4>
          
          {userProfile ? (
            <div className="space-y-6">
              <div className="bg-surface-container-low dark:bg-slate-800 p-4 rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] uppercase font-bold tracking-wider text-tertiary dark:text-white">Salud Basal</p>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs font-bold text-on-surface dark:text-white">IMC</span>
                  <span className="text-xs font-bold text-primary">
                    {(userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs font-bold text-on-surface dark:text-white">Gasto Basal</span>
                  <span className="text-xs font-bold text-primary">
                    {Math.round(10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5)} kcal
                  </span>
                </div>
              </div>

              <div className="bg-primary-container/10 p-4 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Activity size={16} />
                  <span className="text-xs font-bold text-on-primary-container">Longevidad Celular</span>
                </div>
                <p className="text-[11px] leading-relaxed text-tertiary dark:text-white">
                  Tu ingesta de micronutrientes se está controlando. La IA sugiere consumir tés ricos en polifenoles (Té Verde) entre comidas para reducir la oxidación celular.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-tertiary dark:text-white">Cargando perfil...</p>
          )}
        </div>

        <div className="border-t border-outline-variant/10 pt-6">
          <button className="w-full flex items-center justify-center gap-2 border border-outline-variant py-2.5 rounded-xl text-tertiary dark:text-white font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
            <FileText size={14} /> Exportar Reporte Médico
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AiAssistant;
