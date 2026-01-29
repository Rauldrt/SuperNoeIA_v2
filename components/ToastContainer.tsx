import React from 'react';
import { useGemini } from '../context/GeminiContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGemini();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border text-sm font-medium transition-all animate-slide-up
            ${toast.type === 'success' ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 text-emerald-700 dark:text-emerald-200' : ''}
            ${toast.type === 'error' ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20 text-red-700 dark:text-red-200' : ''}
            ${toast.type === 'info' ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500/20 text-brand-700 dark:text-brand-200' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle size={16} />}
          {toast.type === 'error' && <AlertCircle size={16} />}
          {toast.type === 'info' && <Info size={16} />}
          
          <span>{toast.message}</span>
          
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;