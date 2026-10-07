import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { todayStr, uid } from '../utils/helpers';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    /* audio not available */
  }
}

export function AppProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [subjects, setSubjects] = useLocalStorage('subjects', []);
  const [studySessions, setStudySessions] = useLocalStorage('studySessions', []);
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [exams, setExams] = useLocalStorage('exams', []);
  const [pomodoroSettings, setPomodoroSettings] = useLocalStorage('pomodoroSettings', { focus: 25, break: 5 });
  const [userPreferences, setUserPreferences] = useLocalStorage('userPreferences', { name: 'Student', dailyGoal: 4 });
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [focusLog, setFocusLog] = useLocalStorage('focusLog', {});
  const [activity, setActivity] = useLocalStorage('activity', []);

  // ---- theme ----
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ---- toasts ----
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'success') => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // ---- activity ----
  const logActivity = useCallback(
    (text) => setActivity((a) => [{ id: uid(), text, at: new Date().toISOString() }, ...a].slice(0, 30)),
    [setActivity],
  );

  // ---- shared actions ----
  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    setTasks((l) => l.map((t) => (t.id === id ? { ...t, done, completedOn: done ? todayStr() : null } : t)));
    if (done) logActivity(`Completed task "${task.title}"`);
  };

  const toggleHabitDay = (id, date) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const nowDone = !habit.log[date];
    setHabits((l) => l.map((h) => (h.id === id ? { ...h, log: { ...h.log, [date]: nowDone } } : h)));
    if (nowDone && date === todayStr()) logActivity(`Completed habit "${habit.name}"`);
  };

  // ---- Pomodoro (lives here so it keeps running while you browse other pages) ----
  const [timer, setTimer] = useState({
    mode: 'focus', running: false, remaining: pomodoroSettings.focus * 60, endAt: null,
  });
  const [pomoSubject, setPomoSubject] = useState('');
  const latest = useRef({});
  latest.current = { settings: pomodoroSettings, subject: pomoSubject, mode: timer.mode };

  const completeTimer = () => {
    const { settings, subject, mode } = latest.current;
    if (mode === 'focus') {
      const mins = settings.focus;
      const day = todayStr();
      setFocusLog((l) => ({ ...l, [day]: { m: (l[day]?.m || 0) + mins, s: (l[day]?.s || 0) + 1 } }));
      if (subject) {
        setSubjects((l) => l.map((s) => (s.id === subject ? { ...s, hours: Math.round((s.hours + mins / 60) * 100) / 100 } : s)));
      }
      logActivity(`Completed a ${mins}-min focus session`);
      toast(`Focus session complete. ${mins} minutes added to your study time.`);
    } else {
      toast('Break is over. Ready for the next focus session.', 'info');
    }
    beep();
    const next = mode === 'focus' ? 'break' : 'focus';
    setTimer({
      mode: next, running: false, remaining: (next === 'focus' ? settings.focus : settings.break) * 60, endAt: null,
    });
  };

  useEffect(() => {
    if (!timer.running) return undefined;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
      if (left <= 0) completeTimer();
      else setTimer((t) => (t.running ? { ...t, remaining: left } : t));
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.running, timer.endAt]);

  // keep an idle timer in sync with changed durations
  useEffect(() => {
    setTimer((t) => (t.running ? t : {
      ...t, remaining: (t.mode === 'focus' ? pomodoroSettings.focus : pomodoroSettings.break) * 60,
    }));
  }, [pomodoroSettings.focus, pomodoroSettings.break]);

  const startTimer = () => setTimer((t) => ({ ...t, running: true, endAt: Date.now() + t.remaining * 1000 }));
  const pauseTimer = () => setTimer((t) => ({
    ...t, running: false, remaining: Math.max(1, Math.round((t.endAt - Date.now()) / 1000)), endAt: null,
  }));
  const switchMode = (mode) => setTimer({
    mode, running: false, endAt: null,
    remaining: (mode === 'focus' ? pomodoroSettings.focus : pomodoroSettings.break) * 60,
  });
  const resetTimer = () => switchMode(timer.mode);

  const value = {
    tasks, setTasks, subjects, setSubjects, studySessions, setStudySessions, notes, setNotes,
    habits, setHabits, exams, setExams, pomodoroSettings, setPomodoroSettings,
    userPreferences, setUserPreferences, theme, setTheme, focusLog, activity,
    toasts, toast, dismissToast, logActivity, toggleTask, toggleHabitDay,
    timer, startTimer, pauseTimer, resetTimer, switchMode, pomoSubject, setPomoSubject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
