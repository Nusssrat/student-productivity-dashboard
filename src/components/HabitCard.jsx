import { Check, Flame, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_FMT, streaks, todayStr, weekDays } from '../utils/helpers';

export default function HabitCard({ habit, onToggle, onDelete }) {
  const days = weekDays();
  const today = todayStr();
  const { current, best } = streaks(habit.log);
  const doneThisWeek = days.filter((d) => habit.log[format(d, DATE_FMT)]).length;
  const doneToday = !!habit.log[today];

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold">{habit.name}</h3>
          <p className="muted mt-0.5 text-xs">{doneThisWeek} of 7 days this week</p>
        </div>
        <button type="button" className="icon-btn hover:!text-rose-600" onClick={() => onDelete(habit)} aria-label="Delete habit"><Trash2 size={16} /></button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = format(d, DATE_FMT);
          const done = !!habit.log[key];
          const future = key > today;
          return (
            <button
              key={key}
              type="button"
              disabled={future}
              onClick={() => onToggle(habit.id, key)}
              aria-label={`${format(d, 'EEEE')} ${done ? 'completed' : 'not completed'}`}
              className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
              } ${key === today ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-white dark:ring-offset-surface' : ''}`}
            >
              {format(d, 'EEEEE')}
              {done ? <Check size={12} strokeWidth={3} /> : <span className="h-3" />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-semibold"><Flame size={16} className="text-amber-500" />{current} day streak</span>
          <span className="muted">Best {best}</span>
        </div>
        <button type="button" onClick={() => onToggle(habit.id, today)} className={doneToday ? 'btn-ghost !py-1.5' : 'btn-primary !py-1.5'}>
          {doneToday ? 'Undo today' : 'Mark today'}
        </button>
      </div>
    </div>
  );
}
