
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface SystemToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const SystemToastContainer: React.FC<SystemToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <SystemToast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const SystemToast: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-white', border: 'border-green-500', icon: <CheckCircle className="text-green-500" size={20} /> },
    error: { bg: 'bg-white', border: 'border-red-500', icon: <AlertCircle className="text-red-500" size={20} /> },
    info: { bg: 'bg-white', border: 'border-blue-500', icon: <Info className="text-blue-500" size={20} /> },
    warning: { bg: 'bg-white', border: 'border-yellow-500', icon: <AlertTriangle className="text-yellow-500" size={20} /> },
  };

  const style = config[toast.type];

  return (
    <div 
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border-l-4 transition-all duration-300 transform ${style.bg} ${style.border} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800 leading-snug">{toast.message}</p>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-slate-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
