'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

const ToastContext = createContext<{ toast: (message: string, type?: ToastType) => void }>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const icons = { success: CheckCircle, error: AlertTriangle, info: Info };
  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
    info: 'border-accent-500/20 bg-accent-500/10 text-accent-400',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 print:hidden">
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm animate-fade-in-up ${colors[t.type]}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t.message}</span>
              <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="ml-2 opacity-50 hover:opacity-100">
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
