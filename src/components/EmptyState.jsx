import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="card flex flex-col items-center py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-100">
        <Icon size={26} />
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {text && <p className="muted mt-1 max-w-sm text-sm">{text}</p>}
      {action && <button type="button" className="btn-primary mt-5" onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}
