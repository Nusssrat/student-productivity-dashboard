// Central place for ALL localStorage access. Nothing else in the app touches localStorage directly.
const PREFIX = 'spd:';

export const KEYS = [
  'tasks', 'subjects', 'studySessions', 'notes', 'habits', 'exams',
  'pomodoroSettings', 'userPreferences', 'theme', 'focusLog', 'activity',
];

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable: ignore */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
  exportAll() {
    const data = {};
    KEYS.forEach((k) => { data[k] = storage.get(k, null); });
    return { app: 'Student Productivity Dashboard', exportedAt: new Date().toISOString(), data };
  },
  clearAll() {
    KEYS.forEach((k) => storage.remove(k));
    storage.set('initialized', true); // stay empty instead of re-seeding demo data
  },
  loadDemo(demo) {
    Object.entries(demo).forEach(([k, v]) => storage.set(k, v));
    storage.set('initialized', true);
  },
};
