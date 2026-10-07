import { useState } from 'react';
import { Download, Moon, RefreshCw, Sun, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import ConfirmDialog from '../components/ConfirmDialog';
import { createDemoData } from '../data/demo';
import { downloadJSON, todayStr } from '../utils/helpers';
import { storage } from '../utils/storage';

export default function Settings() {
  const { theme, setTheme, userPreferences, setUserPreferences, pomodoroSettings, setPomodoroSettings, toast } = useApp();
  const [f, setF] = useState({
    name: userPreferences.name, dailyGoal: userPreferences.dailyGoal, focus: pomodoroSettings.focus, break: pomodoroSettings.break,
  });
  const [err, setErr] = useState({});
  const [confirm, setConfirm] = useState(null); // 'clear' | 'demo'

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    const goal = Number(f.dailyGoal);
    const focus = Number(f.focus);
    const brk = Number(f.break);
    const errors = {};
    if (!f.name.trim()) errors.name = 'Enter your name.';
    if (!(goal >= 0.5 && goal <= 16)) errors.dailyGoal = 'Choose a goal between 0.5 and 16 hours.';
    if (!Number.isInteger(focus) || focus < 1 || focus > 120) errors.focus = 'Use whole minutes, 1 to 120.';
    if (!Number.isInteger(brk) || brk < 1 || brk > 120) errors.break = 'Use whole minutes, 1 to 120.';
    setErr(errors);
    if (Object.keys(errors).length) return;
    setUserPreferences({ name: f.name.trim(), dailyGoal: goal });
    setPomodoroSettings({ focus, break: brk });
    toast('Preferences saved');
  };

  const exportData = () => {
    downloadJSON(storage.exportAll(), `student-productivity-data-${todayStr()}.json`);
    toast('Your data was exported');
  };

  const run = () => {
    if (confirm === 'clear') storage.clearAll();
    else storage.loadDemo(createDemoData());
    window.location.reload(); // re-read everything from storage
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance, study preferences and your data." />
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="card">
          <h3 className="font-display text-lg font-bold">Appearance</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[['light', 'Light mode', Sun], ['dark', 'Dark mode', Moon]].map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-colors ${
                  theme === value ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100' : 'border-slate-200 dark:border-line'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </section>

        <form onSubmit={save} className="card space-y-4">
          <h3 className="font-display text-lg font-bold">Study preferences</h3>
          <Field label="Your name" error={err.name}><input className="input" value={f.name} onChange={set('name')} /></Field>
          <Field label="Daily study goal (hours)" error={err.dailyGoal}><input type="number" step="0.5" min="0.5" max="16" className="input" value={f.dailyGoal} onChange={set('dailyGoal')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pomodoro focus (min)" error={err.focus}><input type="number" min="1" max="120" className="input" value={f.focus} onChange={set('focus')} /></Field>
            <Field label="Break (min)" error={err.break}><input type="number" min="1" max="120" className="input" value={f.break} onChange={set('break')} /></Field>
          </div>
          <button type="submit" className="btn-primary">Save preferences</button>
        </form>

        <section className="card">
          <h3 className="font-display text-lg font-bold">Data management</h3>
          <p className="muted mt-1 text-sm">Everything is stored in this browser. Nothing is sent to a server.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={exportData}><Download size={16} /> Export My Data</button>
            <button type="button" className="btn-ghost" onClick={() => setConfirm('demo')}><RefreshCw size={16} /> Load demo data</button>
            <button type="button" className="btn-danger" onClick={() => setConfirm('clear')}><Trash2 size={16} /> Clear All Data</button>
          </div>
        </section>
      </div>
      <ConfirmDialog
        open={!!confirm}
        title={confirm === 'clear' ? 'Clear all data' : 'Load demo data'}
        message={confirm === 'clear'
          ? 'This permanently deletes your tasks, notes, habits, subjects, sessions and settings from this browser.'
          : 'This replaces your current data with the sample data.'}
        confirmLabel={confirm === 'clear' ? 'Clear everything' : 'Replace data'}
        onConfirm={run}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
