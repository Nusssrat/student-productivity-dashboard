export const TASK_CATEGORIES = ['Study', 'Assignment', 'Project', 'Exam', 'Personal'];
export const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
export const NOTE_CATEGORIES = ['DBMS', 'OS', 'CN', 'DSA', 'College', 'Personal'];
export const EXAM_TYPES = ['Exam', 'Assignment', 'Project', 'Other'];
export const SUBJECT_COLORS = ['#3b4cca', '#e08a1e', '#0f9d8a', '#d9467a', '#7a4fd6', '#2a8bd1', '#6b8f23', '#c4551d'];

export const PRIORITY_BADGE = {
  high: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
};

const TONES = [
  'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100',
  'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200',
  'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200',
  'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
  'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200',
  'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
];
// Stable badge colour for any label (category, note tag, exam type)
export const toneFor = (label = '') =>
  TONES[[...label].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', title: 'Dashboard' },
  { to: '/tasks', label: 'Tasks', title: 'Tasks' },
  { to: '/planner', label: 'Study Planner', title: 'Study Planner' },
  { to: '/subjects', label: 'Subjects', title: 'Subjects' },
  { to: '/pomodoro', label: 'Pomodoro', title: 'Pomodoro Timer' },
  { to: '/deadlines', label: 'Exams & Deadlines', title: 'Exams & Deadlines' },
  { to: '/notes', label: 'Notes', title: 'Notes' },
  { to: '/habits', label: 'Habits', title: 'Habit Tracker' },
  { to: '/analytics', label: 'Analytics', title: 'Analytics' },
  { to: '/settings', label: 'Settings', title: 'Settings' },
];
