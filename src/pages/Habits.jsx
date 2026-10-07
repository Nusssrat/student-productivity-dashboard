import { useState } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { Flame, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import HabitCard from '../components/HabitCard';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { DATE_FMT, todayStr, uid } from '../utils/helpers';
import { habitRate } from '../utils/stats';

const WEEKS = 12;

function Heatmap({ habits }) {
  const today = todayStr();
  const start = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), -(WEEKS - 1) * 7);
  const cols = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => format(addDays(start, w * 7 + d), DATE_FMT)));
  return (
    <div className="card">
      <h3 className="font-display text-lg font-bold">Activity heatmap</h3>
      <p className="muted mb-4 text-sm">Share of habits completed each day over the last {WEEKS} weeks</p>
      <div className="overflow-x-auto">
        <div className="flex gap-1.5">
          <div className="muted flex flex-col justify-between py-0.5 pr-1 text-[10px] font-semibold">
            {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((l, i) => <span key={i} className="h-5 leading-5">{l}</span>)}
          </div>
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              {col.map((day) => {
                const frac = day > today ? null : habitRate(habits, day);
                return (
                  <div
                    key={day}
                    title={`${format(new Date(`${day}T00:00`), 'EEE d MMM')}: ${frac === null ? 'upcoming' : `${Math.round(frac * 100)}% done`}`}
                    className={`h-5 w-5 rounded-md ${frac === null ? 'opacity-30' : ''} ${!frac ? 'bg-slate-100 dark:bg-white/5' : ''}`}
                    style={frac ? { backgroundColor: `rgba(59,76,202,${0.2 + 0.8 * frac})` } : undefined}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="muted mt-3 flex items-center justify-end gap-1.5 text-xs">
        Less
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <span key={v} className={`h-3.5 w-3.5 rounded ${v === 0 ? 'bg-slate-100 dark:bg-white/5' : ''}`} style={v ? { backgroundColor: `rgba(59,76,202,${0.2 + 0.8 * v})` } : undefined} />
        ))}
        More
      </div>
    </div>
  );
}

export default function Habits() {
  const { habits, setHabits, toggleHabitDay, toast, logActivity } = useApp();
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [del, setDel] = useState(null);

  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) { setErr('Enter a habit name.'); return; }
    if (habits.some((h) => h.name.toLowerCase() === n.toLowerCase())) { setErr('You already track this habit.'); return; }
    setHabits((l) => [...l, { id: uid(), name: n, log: {} }]);
    logActivity(`Started tracking "${n}"`);
    toast('Habit added');
    setName('');
    setErr('');
  };

  return (
    <>
      <PageHeader title="Habit Tracker" subtitle="Small daily actions, tracked by week." />
      <form onSubmit={add} className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input flex-1" value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} placeholder="New habit, e.g. Revise notes for 20 minutes" aria-label="New habit name" />
          <button type="submit" className="btn-primary"><Plus size={18} /> Add habit</button>
        </div>
        {err && <p className="mt-1.5 text-xs font-medium text-rose-600">{err}</p>}
      </form>

      {habits.length === 0 ? (
        <EmptyState icon={Flame} title="No habits yet" text="Add a habit above and mark it every day to build a streak." />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((h) => <HabitCard key={h.id} habit={h} onToggle={toggleHabitDay} onDelete={setDel} />)}
          </div>
          <Heatmap habits={habits} />
        </div>
      )}
      <ConfirmDialog
        open={!!del} title="Delete habit" message={`Delete "${del?.name}" and its streak history?`}
        onConfirm={() => { setHabits((l) => l.filter((h) => h.id !== del.id)); toast('Habit deleted'); setDel(null); }}
        onCancel={() => setDel(null)}
      />
    </>
  );
}
