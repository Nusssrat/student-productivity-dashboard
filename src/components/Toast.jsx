import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const COLORS = { success: 'text-emerald-500', error: 'text-rose-500', info: 'text-brand-500' };

export default function Toast() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || CheckCircle2;
        return (
          <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg dark:border-line dark:bg-surface">
            <Icon size={20} className={`mt-0.5 shrink-0 ${COLORS[t.type]}`} />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button type="button" className="icon-btn !h-6 !w-6" onClick={() => dismissToast(t.id)} aria-label="Dismiss"><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}
