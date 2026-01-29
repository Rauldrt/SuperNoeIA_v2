
import React, { useState, useRef } from 'react';
import { useGemini } from '../context/GeminiContext';
import { 
  Trash2, X, Wifi, Menu, Sparkles,
  Clock, Plus, MessageSquare, Lock,
  Settings, Database, Cloud, FileSpreadsheet, FileText,
  ShieldCheck, ShieldAlert, Search, LogOut, KeyRound,
  Sun, Moon, Monitor, HardDrive, RefreshCw, FileJson, Copy, Table, FileCode, Info
} from 'lucide-react';
import { DEFAULT_MODEL, REASONING_MODEL, Theme } from '../types';
import { CLIENT_CONFIG } from '../clientConfig';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const { 
      sessions, activeSessionId, loadSession, deleteSession, createNewChat, clearHistory,
      isAdminMode, loginAdmin, logoutAdmin,
      documents, addDocument, removeDocument, config, updateConfig, addToast,
      theme, setTheme, refreshDynamicKnowledge, isLoadingKnowledge
    } = useGemini();

    const [activeTab, setActiveTab] = useState<'history' | 'docs' | 'config'>('history');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleNewChat = () => {
        createNewChat();
        if (window.innerWidth < 768 && onClose) onClose();
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return 'Hace 7 días';
        return date.toLocaleDateString();
    };

    const handleAdminToggle = () => {
        if (isAdminMode) {
            logoutAdmin();
            setActiveTab('history');
        } else {
            setShowLoginModal(true);
            setPasswordInput('');
        }
    };

    const submitLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginAdmin(passwordInput)) {
            setShowLoginModal(false);
            setPasswordInput('');
            setActiveTab('config');
        }
    };

    const cycleTheme = () => {
        const modes: Theme[] = ['light', 'dark', 'system'];
        const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
        setTheme(modes[nextIndex]);
        addToast('info', `Tema: ${modes[nextIndex] === 'system' ? 'Automático' : modes[nextIndex] === 'dark' ? 'Oscuro' : 'Claro'}`);
    };

    const getThemeIcon = () => {
        switch(theme) {
            case 'light': return <Sun size={14} />;
            case 'dark': return <Moon size={14} />;
            case 'system': return <Monitor size={14} />;
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const text = await file.text();
            addDocument(file.name, text);
          } catch (err) {
            addToast('error', `Error al leer: ${file.name}`);
          }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.toLowerCase().endsWith('.csv') || fileName.includes('Precio')) return <FileSpreadsheet size={16} />;
        return <FileText size={16} />;
    };

    const handleDownloadJSON = () => {
        const jsonString = JSON.stringify(documents, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `backup-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <div className="flex flex-col h-full w-full relative">
            {isAdminMode && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 z-50"></div>
            )}

            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className={isAdminMode ? "text-amber-500" : "text-brand-500"} size={20} />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    {isAdminMode ? "Admin Panel" : CLIENT_CONFIG.shortName}
                    </h1>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-brand-500 transition-colors">
                    <X size={24} />
                    </button>
                )}
            </div>

            {/* Status Bar */}
            <div className={`px-6 py-2 flex items-center justify-between text-xs font-medium border-b border-gray-100 dark:border-white/5 ${isAdminMode ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400'}`}>
                <div className="flex items-center gap-2">
                    {isAdminMode ? <ShieldCheck size={12} /> : <Wifi size={12} />}
                    <span>{isAdminMode ? 'Superusuario' : 'Sincronizado'}</span>
                </div>
                {config.publicCsvUrl && (
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Cloud size={10} /> Online
                    </span>
                )}
            </div>

            {/* NEW CHAT BUTTON */}
            <div className="p-4">
                <button 
                    onClick={handleNewChat}
                    className="w-full btn-aurora flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 font-medium text-white"
                >
                    <Plus size={20} />
                    <span>Nuevo Chat</span>
                </button>
            </div>

            {/* ADMIN TABS */}
            {isAdminMode && (
                <div className="flex px-4 pb-2 gap-1 border-b border-gray-100 dark:border-white/10 shrink-0 animate-fade-in-down">
                    <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${activeTab === 'history' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-200 font-bold' : 'text-gray-400'}`}><Clock size={16} /></button>
                    <button onClick={() => setActiveTab('docs')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${activeTab === 'docs' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-200 font-bold' : 'text-gray-400'}`}><Database size={16} /></button>
                    <button onClick={() => setActiveTab('config')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${activeTab === 'config' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-200 font-bold' : 'text-gray-400'}`}><Settings size={16} /></button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar mt-2 relative">
                
                {/* LOGIN MODAL */}
                {showLoginModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                        <div className="w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden animate-menu-circular">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 flex justify-between items-center text-white">
                                <span className="text-sm font-bold flex items-center gap-2"><Lock size={14} /> Admin</span>
                                <button onClick={() => setShowLoginModal(false)}><X size={14} /></button>
                            </div>
                            <form onSubmit={submitLogin} className="p-4 space-y-3">
                                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Contraseña" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm" autoFocus />
                                <button type="submit" className="w-full py-2 bg-amber-500 text-white rounded-lg text-sm font-bold">Entrar</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* HISTORY */}
                {activeTab === 'history' && (
                    <>
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Tu Historial</span>
                            {sortedSessions.length > 0 && <button onClick={clearHistory} className="text-[10px] text-red-400 hover:underline">Borrar todo</button>}
                        </div>
                        {sortedSessions.length === 0 ? (
                            <div className="text-center text-gray-400 py-12"><Clock size={20} className="mx-auto mb-2 opacity-40" />Sin chats.</div>
                        ) : (
                            sortedSessions.map(session => (
                                <div key={session.id} onClick={() => { loadSession(session.id); if (onClose) onClose(); }} className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${activeSessionId === session.id ? 'bg-white dark:bg-slate-800 border-brand-200 dark:border-brand-500/50' : 'border-transparent hover:bg-white dark:hover:bg-slate-800/50'}`}>
                                    <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400"><MessageSquare size={16} /></div>
                                    <div className="flex flex-col flex-1 min-w-0"><span className="text-sm font-medium truncate text-gray-600 dark:text-gray-300">{session.title}</span><span className="text-[10px] text-gray-400">{formatDate(session.updatedAt)}</span></div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))
                        )}
                    </>
                )}

                {/* CONFIG */}
                {isAdminMode && activeTab === 'config' && (
                    <div className="space-y-6 animate-fade-in pt-2">
                        
                        {/* INSTRUCTIONS INFO BOX (New) */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <Info size={16} />
                                <span className="text-xs font-bold uppercase">Instrucciones de Mantenimiento</span>
                            </div>
                            <ul className="text-[10px] text-gray-600 dark:text-gray-400 space-y-1 ml-1 list-disc list-inside">
                                <li><b>Precios:</b> Se actualizan editando el Google Sheet (online). El bot los lee automáticamente.</li>
                                <li><b>Identidad:</b> Para cambiar nombre, colores o logo, editar <code>clientConfig.ts</code>.</li>
                                <li><b>Políticas y Horarios:</b> Fijos en código (<code>data/staticKnowledge.ts</code>).</li>
                                <li><b>Instrucciones IA:</b> Para cambiar el comportamiento por defecto, editar en código: <code>context/GeminiContext.tsx</code>.</li>
                            </ul>
                        </div>

                        {/* 1. CSV Config */}
                        <div className="space-y-4 border-b border-gray-100 dark:border-white/5 pb-4">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                                <Table size={12} /> Base de Datos (CSV)
                            </label>
                            <div className="space-y-1">
                                <input 
                                    type="text"
                                    value={config.publicCsvUrl}
                                    onChange={(e) => updateConfig({ publicCsvUrl: e.target.value })}
                                    placeholder="https://docs.google.com/.../pub?output=csv"
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-600 dark:text-gray-300"
                                />
                                <p className="text-[9px] text-gray-400">
                                    En Sheets: <b>Archivo {'>'} Compartir {'>'} Publicar en la web {'>'} CSV</b>.
                                </p>
                            </div>
                            <button 
                                onClick={refreshDynamicKnowledge}
                                disabled={isLoadingKnowledge}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                {isLoadingKnowledge ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                Sincronizar Precios Ahora
                            </button>
                        </div>

                        {/* 2. System Instructions */}
                         <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                                <FileCode size={12} /> Instrucciones del Sistema
                            </label>
                            <textarea 
                                value={config.systemInstructions}
                                onChange={(e) => updateConfig({ systemInstructions: e.target.value })}
                                className="w-full h-24 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 ring-brand-500 outline-none resize-none custom-scrollbar"
                                placeholder="Define la personalidad, reglas y comportamiento del bot aquí..."
                            />
                        </div>

                        {/* 3. RAG Strategy */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Estrategia RAG</label>
                            <div onClick={() => updateConfig({ strictMode: !config.strictMode })} className={`aurora-container rounded-lg cursor-pointer p-3 border flex items-center gap-3 ${config.strictMode ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200' : 'bg-white dark:bg-slate-800'}`}>
                                {config.strictMode ? <ShieldCheck size={20} className="text-brand-600" /> : <ShieldAlert size={20} className="text-gray-400" />}
                                <div className="flex-1"><span className="text-sm font-bold block">{config.strictMode ? 'Estricto' : 'Híbrido'}</span></div>
                            </div>
                        </div>

                        {/* 4. Model & Search */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Modelo</label>
                            <select value={config.model} onChange={(e) => updateConfig({ model: e.target.value })} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm">
                                <option value={DEFAULT_MODEL}>Gemini 3 Flash</option>
                                <option value={REASONING_MODEL}>Gemini 3 Pro</option>
                            </select>
                        </div>

                         <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5">
                            <div className="flex items-center gap-2"><Search size={16} className="text-brand-500" /><span className="text-sm">Google Search</span></div>
                            <input type="checkbox" checked={config.useSearchGrounding} onChange={(e) => updateConfig({ useSearchGrounding: e.target.checked })} className="accent-brand-500" disabled={config.strictMode} />
                        </div>
                    </div>
                )}

                {/* DOCS TAB */}
                {isAdminMode && activeTab === 'docs' && (
                    <div className="space-y-4 animate-fade-in pt-2">
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-slate-900 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 group">
                            <HardDrive size={32} className="text-gray-400 mb-2 group-hover:text-brand-500" />
                            <span className="text-sm font-medium">Cargar Documento Local</span>
                            <input type="file" multiple ref={fileInputRef} className="hidden" accept=".txt,.md,.csv" onChange={handleFileUpload} />
                        </div>

                        <div className="space-y-2">
                            {documents.map(doc => (
                                <div key={doc.id} className={`flex items-center justify-between p-3 rounded-lg border ${doc.isSystem ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200' : 'bg-white dark:bg-slate-800'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={doc.isSystem ? "text-amber-500" : "text-brand-500"}>{getFileIcon(doc.title)}</div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-medium truncate flex items-center gap-1">{doc.title} {doc.isSystem && <Lock size={10} className="text-amber-500" />}</span>
                                            <span className="text-[10px] text-gray-400">{doc.tokensEstimated} tokens • {doc.isSystem ? 'Sistema' : 'Local'}</span>
                                        </div>
                                    </div>
                                    {!doc.isSystem && <button onClick={() => removeDocument(doc.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleDownloadJSON} className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 text-[10px]"><FileJson size={12} /> Exportar Backup</button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center gap-2">
                <button onClick={cycleTheme} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">{getThemeIcon()}<span className="text-[10px] font-medium capitalize">{theme}</span></button>
                <button onClick={handleAdminToggle} className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isAdminMode ? 'bg-amber-100 text-amber-700' : 'text-gray-300 hover:bg-gray-100'}`}>{isAdminMode ? <LogOut size={12} /> : <Lock size={12} />}<span className="text-[10px] font-medium">{isAdminMode ? 'Salir' : 'Admin'}</span></button>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
      <div className={`fixed z-50 w-[22.5rem] transition-all duration-300 ease-spring inset-y-0 left-0 md:top-4 md:bottom-4 md:left-4 md:h-[calc(100vh-2rem)] md:rounded-[2rem] md:border md:border-gray-200 md:dark:border-white/10 md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        <div className="h-full w-full overflow-hidden md:rounded-[2rem]"><SidebarContent onClose={() => setIsOpen(false)} /></div>
      </div>
      <button onClick={() => setIsOpen(true)} className={`fixed top-4 left-4 z-30 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 md:hidden text-gray-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}><Menu size={24} /></button>
    </>
  );
};

export default Sidebar;
