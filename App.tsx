
import React, { useState, useEffect } from 'react';
import { GeminiProvider } from './context/GeminiContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ToastContainer from './components/ToastContainer';
import { applyClientTheme } from './utils/themeUtils';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile

  // Ajuste inicial para escritorio y aplicación de TEMA
  useEffect(() => {
    // Aplicar configuración de marca blanca (Colores, Título, etc.)
    applyClientTheme();

    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Background Ambience Animated */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Usamos 'brand' en lugar de colores fijos para que se adapte al tema del cliente */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-400/20 dark:bg-brand-600/10 blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-300/20 dark:bg-brand-500/10 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-brand-200/20 dark:bg-brand-400/10 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full h-full flex">
         <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
         <div className="flex-1 h-full relative">
            <ChatArea sidebarOpen={sidebarOpen} />
         </div>
      </div>

      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GeminiProvider>
      <Layout />
    </GeminiProvider>
  );
};

export default App;
