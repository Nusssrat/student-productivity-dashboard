import { lastNDays } from './helpers';

export const minutesOn = (focusLog, day) => focusLog[day]?.m || 0;

export const habitRate = (habits, day) =>
  habits.length ? habits.filter((h) => h.log[day]).length / habits.length : 0;

export function taskRate(tasks, day) {
  const due = tasks.filter((t) => t.due === day);
  if (due.length) return due.filter((t) => t.done).length / due.length;
  return tasks.some((t) => t.done && t.completedOn === day) ? 1 : 0;
}

// 0-100 score for one day: 40% study goal, 30% habits, 30% tasks
export function dayScore({ tasks, habits, focusLog, goalHours }, day) {
  const goalMin = goalHours * 60;
  const goal = goalMin ? Math.min(1, minutesOn(focusLog, day) / goalMin) : 0;
  return Math.round(100 * (0.4 * goal + 0.3 * habitRate(habits, day) + 0.3 * taskRate(tasks, day)));
}

export const weeklyAverage = (data) =>
  Math.round(lastNDays(7).reduce((sum, d) => sum + dayScore(data, d), 0) / 7);
