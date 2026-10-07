import { Pencil, Trash2 } from 'lucide-react';
import { toneFor } from '../utils/constants';
import { countdown, fmtDate, fmtTime12 } from '../utils/helpers';

const STATUS_BADGE = {
  overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  today: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  tomorrow: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  upcoming: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100',
};

export default function ExamCard({ item, compact = false, onEdit, onDelete }) {
  const c = countdown(item);
  return (
    <div className="card !p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{item.title} <span className={c.status === 'overdue' ? 'text-rose-600' : 'text-brand-600 dark:text-brand-100'}>{c.phrase}</span></p>
          <p className="muted mt-1 text-xs">
            {fmtDate(item.date, 'EEE, d MMM yyyy')}{item.time ? ` at ${fmtTime12(item.time)}` : ''}
          </p>
        </div>
        <span className={`badge shrink-0 ${STATUS_BADGE[c.status]}`}>{c.badge}</span>
      </div>
      {!compact && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`badge ${toneFor(item.type)}`}>{item.type}</span>
            {item.subject && <span className="badge bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.subject}</span>}
          </div>
          {item.description && <p className="muted mt-3 text-sm">{item.description}</p>}
          <div className="mt-3 flex justify-end">
            <button type="button" className="icon-btn" onClick={() => onEdit(item)} aria-label="Edit"><Pencil size={16} /></button>
            <button type="button" className="icon-btn hover:!text-rose-600" onClick={() => onDelete(item)} aria-label="Delete"><Trash2 size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
}
