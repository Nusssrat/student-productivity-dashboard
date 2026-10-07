import { Pause, Play, RotateCcw } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { useApp } from '../context/AppContext';
import { fmtClock } from '../utils/helpers';

export default function PomodoroTimer() {
  const { timer, startTimer, pauseTimer, resetTimer, switchMode, subjects, pomoSubject, setPomoSubject, pomodoroSettings } = useApp();
  const total = (timer.mode === 'focus' ? pomodoroSettings.focus : pomodoroSettings.break) * 60;
  const elapsed = total ? ((total - timer.remaining) / total) * 100 : 0;

  return (
    <div className="card flex flex-col items-center py-8">
      <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        {['focus', 'break'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-lg px-5 py-1.5 text-sm font-semibold capitalize transition-colors ${
              timer.mode === m ? 'bg-white shadow-sm dark:bg-surface' : 'muted'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <ProgressRing value={elapsed} size={248} stroke={14} color={timer.mode === 'focus' ? '#3b4cca' : '#0f9d8a'}>
        <div>
          <p className="font-display text-6xl font-bold tabular-nums">{fmtClock(timer.remaining)}</p>
          <p className="muted mt-1 text-sm font-semibold">{timer.mode === 'focus' ? 'Stay focused' : 'Take a break'}</p>
        </div>
      </ProgressRing>
      <div className="mt-8 flex gap-3">
        {timer.running ? (
          <button type="button" className="btn-primary !px-6" onClick={pauseTimer}><Pause size={18} /> Pause</button>
        ) : (
          <button type="button" className="btn-primary !px-6" onClick={startTimer}><Play size={18} /> Start</button>
        )}
        <button type="button" className="btn-ghost" onClick={resetTimer}><RotateCcw size={16} /> Reset</button>
      </div>
      {timer.mode === 'focus' && (
        <div className="mt-6 w-full max-w-xs">
          <label className="muted mb-1.5 block text-center text-xs font-semibold" htmlFor="pomo-subject">Log study time to a subject (optional)</label>
          <select id="pomo-subject" className="input" value={pomoSubject} onChange={(e) => setPomoSubject(e.target.value)}>
            <option value="">No subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
