import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3500, variant = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isError = variant === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in duration-300">
      <div className={`flex items-center gap-3 pl-4 pr-2 py-3 rounded-2xl shadow-2xl text-white text-xs font-bold ${isError ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-1 p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;