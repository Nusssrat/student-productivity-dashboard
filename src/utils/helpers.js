import {
  addDays, differenceInCalendarDays, format, isValid, parseISO, startOfWeek,
} from 'date-fns';

export const DATE_FMT = 'yyyy-MM-dd';
export const todayStr = () => format(new Date(), DATE_FMT);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const fmtDate = (d, f = 'dd MMM yyyy') => {
  if (!d) return '';
  const p = parseISO(d);
  return isValid(p) ? format(p, f) : '';
};

export const daysFromToday = (dateStr) => differenceInCalendarDays(parseISO(dateStr), new Date());

// Monday to Sunday of the week containing `ref`
export const weekDays = (ref = new Date()) => {
  const start = startOfWeek(ref, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// ['2025-01-01', ...] ending today
export const lastNDays = (n) =>
  Array.from({ length: n }, (_, i) => format(addDays(new Date(), i - (n - 1)), DATE_FMT));

export const minutesBetween = (start, end) => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
};

export const fmtHours = (min) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const fmtClock = (sec) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

export const fmtTime12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const upsert = (list, item) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];

export const byDateTime = (a, b) =>
  `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`);

// Countdown text for exams and deadlines
export function countdown(item) {
  const d = daysFromToday(item.date);
  if (d < 0) return { status: 'overdue', phrase: `was due ${-d} day${-d > 1 ? 's' : ''} ago`, badge: 'Overdue' };
  if (d === 0) return { status: 'today', phrase: 'is today', badge: 'Today' };
  if (d === 1) return { status: 'tomorrow', phrase: 'is tomorrow', badge: 'Tomorrow' };
  return { status: 'upcoming', phrase: `in ${d} days`, badge: 'Upcoming' };
}

// Current and best streak from a { 'yyyy-MM-dd': true } log
export function streaks(log = {}) {
  const days = Object.keys(log).filter((d) => log[d]).sort();
  let best = 0;
  let run = 0;
  let prev = null;
  days.forEach((d) => {
    run = prev && differenceInCalendarDays(parseISO(d), parseISO(prev)) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  let cursor = new Date();
  if (!log[format(cursor, DATE_FMT)]) cursor = addDays(cursor, -1);
  let current = 0;
  while (log[format(cursor, DATE_FMT)]) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  return { current, best };
}

export function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
