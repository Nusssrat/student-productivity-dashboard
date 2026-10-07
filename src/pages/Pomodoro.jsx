import { useEffect, useState } from 'react';
import { Clock, Target, Timer, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import PomodoroTimer from '../components/PomodoroTimer';
import StatCard from '../components/StatCard';
import Field from '../components/Field';
import { fmtHours, todayStr } from '../utils/helpers';

export default function Pomodoro() {
  const { focusLog, pomodoroSettings, setPomodoroSettings, toast } = useApp();
  const [f, setF] = useState({ focus: pomodoroSettings.focus, break: pomodoroSettings.break });
  const [err, setErr] = useState('');

  useEffect(() => {
    setF({ focus: pomodoroSettings.focus, break: pomodoroSettings.break });
  }, [pomodoroSettings]);

  const entries = Object.entries(focusLog);
  const totalMin = entries.reduce((s, [, v]) => s + v.m, 0);
  const totalSessions = entries.reduce((s, [, v]) => s + v.s, 0);
  const today = focusLog[todayStr()] || { m: 0, s: 0 };

  const save = (e) => {
    e.preventDefault();
    const focus = Number(f.focus);
    const brk = Number(f.break);
    const valid = (n) => Number.isInteger(n) && n >= 1 && n <= 120;
    if (!valid(focus) || !valid(brk)) { setErr('Enter whole minutes between 1 and 120.'); return; }
    setErr('');
    setPomodoroSettings({ focus, break: brk });
    toast('Timer durations saved');
  };

  return (
    <>
      <PageHeader title="Pomodoro Timer" subtitle="Work in focused blocks. Completed sessions are added to your study time." />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3"><PomodoroTimer /></div>
        <div className="space-y-4 lg:col-span-2">
          <StatCard icon={Target} label="Sessions today" value={today.s} />
          <StatCard icon={Clock} label="Focus time today" value={fmtHours(today.m)} tone="amber" />
          <StatCard icon={Timer} label="Total focus time" value={fmtHours(totalMin)} tone="teal" />
          <StatCard icon={TrendingUp} label="Total sessions" value={totalSessions} tone="rose" />
          <form onSubmit={save} className="card space-y-3">
            <h3 className="font-display text-lg font-bold">Customize durations</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Focus (min)"><input type="number" min="1" max="120" className="input" value={f.focus} onChange={(e) => setF((p) => ({ ...p, focus: e.target.value }))} /></Field>
              <Field label="Break (min)"><input type="number" min="1" max="120" className="input" value={f.break} onChange={(e) => setF((p) => ({ ...p, break: e.target.value }))} /></Field>
            </div>
            {err && <p className="text-xs font-medium text-rose-600">{err}</p>}
            <button type="submit" className="btn-primary w-full">Save durations</button>
          </form>
        </div>
      </div>
    </>
  );
}
