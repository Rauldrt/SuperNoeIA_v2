
import React, { useState, useEffect, useRef } from 'react';
import { useGemini } from '../context/GeminiContext';
import { Send, User, FileText, Loader2, MessageCircle, HelpCircle, X, ShoppingBag, ChefHat, Sparkles, Tag, Utensils, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CLIENT_CONFIG } from '../clientConfig';

const ChatArea: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { messages, sendMessage, isTyping } = useGemini();
  const [input, setInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShareWhatsapp = (text: string) => {
    const header = `*Hola, te comparto esta consulta realizada al ${CLIENT_CONFIG.botName}:*\n\n`;
    const fullMessage = `${header}${text}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  // --- Configuration ---
  const helpTopics = [
    {
      icon: <ShoppingBag className="text-brand-500" size={20} />,
      title: "Consultar Precios",
      text: "Pregunta por productos específicos o categorías. Ej: '¿Cuánto cuesta...?'"
    },
    {
      icon: <ChefHat className="text-brand-400" size={20} />,
      title: "Ideas y Usos",
      text: "Pide sugerencias de qué hacer con los productos disponibles."
    },
    {
      icon: <FileText className="text-brand-600" size={20} />,
      title: "Catálogos y Ofertas",
      text: "El bot busca en los documentos subidos sobre ofertas vigentes."
    }
  ];

  const quickActions = [
    { icon: <Tag size={14} />, label: 'Ofertas', prompt: '¿Qué ofertas hay hoy?' },
    { icon: <Utensils size={14} />, label: 'Ayuda', prompt: '¿Qué puedes hacer?' },
    { icon: <Search size={14} />, label: 'Buscar', prompt: 'Busca información sobre...' }
  ];

  return (
    <div className={`flex flex-col h-full transition-all duration-300 relative ${sidebarOpen ? 'md:ml-[24rem]' : 'ml-0'}`}>
      
      {/* Help FAB (Floating Action Button) */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur shadow-lg border transition-all duration-300 ${showHelp ? 'bg-brand-500 border-brand-400 text-white rotate-180' : 'bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-white/10 text-gray-500 hover:text-brand-500 hover:scale-110'}`}
          title="Ayuda sobre cómo usar el chat"
        >
          {showHelp ? <X size={20} /> : <HelpCircle size={20} />}
        </button>
      </div>

      {/* Sticky Quick Actions Header (Visible when there are messages) */}
      {messages.length > 0 && (
         <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-4 pointer-events-none">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm rounded-full p-1 flex gap-1 pointer-events-auto animate-fade-in-down">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => setInput(action.prompt)}
                        className="px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 group"
                    >
                        <span className="text-brand-500 group-hover:scale-110 transition-transform">{action.icon}</span>
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
         </div>
      )}

      {/* Help Modal Overlay (Transparent click catcher) */}
      {showHelp && (
        <div 
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" 
            onClick={() => setShowHelp(false)}
        />
      )}

      {/* Help Modal - Popover Style with Circular Animation */}
      {showHelp && (
          <div 
             className="absolute top-16 right-4 z-50 w-[90vw] max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 animate-menu-circular origin-top-right"
             onClick={(e) => e.stopPropagation()}
          >
            {/* Header Aurora */}
            <div className="h-24 aurora-container w-full relative">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 z-10" />
               <div className="absolute bottom-4 left-6 z-20">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                   <Sparkles className="text-brand-500" size={20} />
                   Guía Rápida
                 </h3>
                 <p className="text-xs text-gray-600 dark:text-gray-300">Saca el máximo provecho a tu asistente.</p>
               </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              {helpTopics.map((topic, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    {topic.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{topic.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{topic.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-white/5 text-center">
              <button 
                onClick={() => setShowHelp(false)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline w-full py-1"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
      )}

      {/* Messages Area */}
      {/* Added pt-20 when messages exist to accommodate the Sticky Header without overlap */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth ${messages.length > 0 ? 'pt-20' : ''}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 animate-fade-in">
            {/* Aurora Bot Avatar Large - WELCOME SCREEN */}
            <div className="aurora-container aurora-always rounded-full p-2 mb-6">
                 <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center relative z-10 border-4 border-white/20 overflow-hidden shadow-xl">
                    <img 
                      src={CLIENT_CONFIG.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover p-2"
                    />
                 </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">{CLIENT_CONFIG.welcomeTitle}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              {CLIENT_CONFIG.welcomeSubtitle}
            </p>
            
            {/* Quick Action Buttons for Empty State - Uses same config as sticky header */}
            <div className="flex gap-2 mt-6 flex-wrap justify-center">
                {quickActions.map((action, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setInput(action.prompt)} 
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-full text-xs hover:border-brand-400 transition-all shadow-sm group"
                    >
                        <span className="text-brand-500">{action.icon}</span>
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar Bot - CHAT MESSAGE */}
              {msg.role === 'model' && (
                <div className={`relative mt-1 w-10 h-10 shrink-0 rounded-full transition-all duration-300 ${msg.isStreaming ? 'animate-thinking' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shadow-md">
                        <img 
                          src={CLIENT_CONFIG.logoUrl} 
                          alt="AI" 
                          className="w-full h-full object-cover p-1"
                        />
                    </div>
                </div>
              )}

              {/* Message Bubble */}
              <div 
                className={`
                  relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm flex flex-col gap-3
                  ${msg.role === 'user' 
                    ? 'btn-aurora text-white rounded-br-none shadow-[0_4px_15px_rgba(var(--color-brand-500),0.3)]' 
                    : 'bg-white dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                  }
                `}
              >
                {/* RAG Indicators */}
                {msg.usedDocuments && msg.usedDocuments.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                      <span className={`text-[10px] uppercase font-bold opacity-70 ${msg.role === 'user' ? 'text-white/80' : 'text-brand-500'}`}>Fuentes:</span>
                      {msg.usedDocuments.map((docId, idx) => (
                        <div key={idx} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${msg.role === 'user' ? 'bg-black/20 border-white/20 text-white' : 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-300'}`}>
                           <FileText size={10} />
                           <span>Doc</span>
                        </div>
                      ))}
                   </div>
                )}

                {/* Content */}
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                  {msg.role === 'model' ? (
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                     <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-brand-400 animate-pulse align-middle"></span>}
                </div>

                {/* Bot Actions Toolbar */}
                {msg.role === 'model' && !msg.isStreaming && (
                    <div className="pt-2 mt-1 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2">
                        <span className="text-[10px] text-gray-400 mr-auto">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        
                        <button 
                            onClick={() => handleShareWhatsapp(msg.content)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs font-medium border border-emerald-200 dark:border-emerald-500/20"
                            title="Enviar pedido o consulta por WhatsApp"
                        >
                            <MessageCircle size={14} />
                            <span>Enviar a WhatsApp</span>
                        </button>
                    </div>
                )}
              </div>

              {/* Avatar User */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-gray-300 dark:border-white/10">
                  <User size={16} className="text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Redesigned Floating Capsule */}
      <div className="p-4 md:p-6 bg-transparent">
        <div className="max-w-4xl mx-auto relative aurora-container rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-brand-500/30 transition-shadow duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={CLIENT_CONFIG.inputPlaceholder}
            className="w-full relative z-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-[2rem] pl-6 pr-14 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none overflow-hidden transition-all focus:ring-1 focus:ring-brand-500/50"
            rows={1}
            style={{ minHeight: '60px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              absolute right-3 top-3 z-20 p-2.5 rounded-full transition-all
              ${!input.trim() || isTyping 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-slate-700/50' 
                : 'btn-aurora text-white shadow-lg shadow-brand-500/30 transform hover:-translate-y-0.5 hover:scale-105'
              }
            `}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-3 font-medium tracking-wide">
          {CLIENT_CONFIG.footerText}
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
