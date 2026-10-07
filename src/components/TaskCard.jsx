import { Check, Pencil, Trash2 } from 'lucide-react';
import { PRIORITY_BADGE, toneFor } from '../utils/constants';
import { daysFromToday, fmtDate } from '../utils/helpers';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const d = task.due ? daysFromToday(task.due) : null;
  const overdue = !task.done && d !== null && d < 0;
  let dueText = 'No due date';
  if (d !== null) {
    if (d === 0) dueText = 'Due today';
    else if (d === 1) dueText = 'Due tomorrow';
    else if (d < 0) dueText = `Overdue since ${fmtDate(task.due, 'd MMM')}`;
    else dueText = `Due ${fmtDate(task.due, 'd MMM')}`;
  }
  return (
    <div className="card flex items-center gap-3 !p-4">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.done}
        aria-label={task.done ? 'Mark as pending' : 'Mark as completed'}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          task.done ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 hover:border-brand-500 dark:border-slate-600'
        }`}
      >
        {task.done && <Check size={14} strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${task.done ? 'muted line-through' : ''}`}>{task.title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`badge ${toneFor(task.category)}`}>{task.category}</span>
          <span className={`badge capitalize ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
          <span className={`text-xs font-medium ${overdue ? 'text-rose-600' : 'muted'}`}>{dueText}</span>
        </div>
      </div>
      <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task"><Pencil size={16} /></button>
      <button type="button" className="icon-btn hover:!text-rose-600" onClick={() => onDelete(task)} aria-label="Delete task"><Trash2 size={16} /></button>
    </div>
  );
}
