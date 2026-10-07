import { Pencil, Trash2 } from 'lucide-react';
import { fmtTime12 } from '../utils/helpers';

export default function StudySessionCard({ session, color = '#3b4cca', onEdit, onDelete }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-2.5 dark:border-line dark:bg-night" style={{ borderLeft: `4px solid ${color}` }}>
      <p className="truncate text-sm font-bold">{session.subject}</p>
      <p className="muted text-xs">{fmtTime12(session.start)} to {fmtTime12(session.end)}</p>
      {session.notes && <p className="muted mt-1 line-clamp-2 text-xs">{session.notes}</p>}
      <div className="mt-1.5 flex gap-1">
        <button type="button" className="icon-btn !h-7 !w-7" onClick={() => onEdit(session)} aria-label="Edit session"><Pencil size={14} /></button>
        <button type="button" className="icon-btn !h-7 !w-7 hover:!text-rose-600" onClick={() => onDelete(session)} aria-label="Delete session"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
