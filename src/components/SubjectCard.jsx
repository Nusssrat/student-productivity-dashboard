import { Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import ProgressRing from './ProgressRing';

export const subjectProgress = (s) => (s.totalTopics ? Math.round((s.doneTopics / s.totalTopics) * 100) : 0);

export default function SubjectCard({ subject, onStep, onEdit, onDelete }) {
  const pct = subjectProgress(subject);
  const remaining = Math.max(0, subject.totalTopics - subject.doneTopics);
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />
          <h3 className="truncate font-display text-lg font-bold">{subject.name}</h3>
        </div>
        <div className="flex shrink-0">
          <button type="button" className="icon-btn" onClick={() => onEdit(subject)} aria-label="Edit subject"><Pencil size={16} /></button>
          <button type="button" className="icon-btn hover:!text-rose-600" onClick={() => onDelete(subject)} aria-label="Delete subject"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <ProgressRing value={pct} size={88} stroke={9} color={subject.color}>
          <span className="font-display text-lg font-bold">{pct}%</span>
        </ProgressRing>
        <dl className="grid flex-1 grid-cols-3 gap-2 text-center">
          <div><dd className="font-display text-lg font-bold">{subject.hours}</dd><dt className="muted text-xs">Hours</dt></div>
          <div><dd className="font-display text-lg font-bold">{subject.doneTopics}</dd><dt className="muted text-xs">Done</dt></div>
          <div><dd className="font-display text-lg font-bold">{remaining}</dd><dt className="muted text-xs">Left</dt></div>
        </dl>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-white/5">
        <span className="muted pl-2 text-xs font-semibold">Topics completed</span>
        <div className="flex items-center gap-1">
          <button type="button" className="icon-btn" disabled={subject.doneTopics <= 0} onClick={() => onStep(subject.id, -1)} aria-label="Mark one topic as not done"><Minus size={16} /></button>
          <button type="button" className="icon-btn" disabled={subject.doneTopics >= subject.totalTopics} onClick={() => onStep(subject.id, 1)} aria-label="Mark one more topic as done"><Plus size={16} /></button>
        </div>
      </div>
    </div>
  );
}
