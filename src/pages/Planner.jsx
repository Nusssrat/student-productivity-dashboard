import { useEffect, useState } from 'react';
import { addWeeks, format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Field from '../components/Field';
import StudySessionCard from '../components/StudySessionCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { DATE_FMT, minutesBetween, todayStr, uid, weekDays } from '../utils/helpers';

const blank = (date) => ({ subject: '', date, start: '17:00', end: '18:00', notes: '' });

export default function Planner() {
  const { studySessions, setStudySessions, subjects, toast, logActivity } = useApp();
  const [offset, setOffset] = useState(0);
  const [modal, setModal] = useState({ open: false, session: null, date: todayStr() });
  const [f, setF] = useState(blank(todayStr()));
  const [err, setErr] = useState({});
  const [del, setDel] = useState(null);

  const days = weekDays(addWeeks(new Date(), offset));
  const today = todayStr();

  useEffect(() => {
    if (!modal.open) return;
    setF(modal.session ? { ...modal.session } : blank(modal.date));
    setErr({});
  }, [modal]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const close = () => setModal({ open: false, session: null, date: today });

  const submit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!f.subject.trim()) errors.subject = 'Enter a subject.';
    if (!f.date) errors.date = 'Pick a date.';
    if (!f.start || !f.end || minutesBetween(f.start, f.end) <= 0) errors.end = 'End time must be after start time.';
    setErr(errors);
    if (Object.keys(errors).length) return;
    const clean = { ...f, subject: f.subject.trim() };
    if (modal.session) {
      setStudySessions((l) => l.map((s) => (s.id === modal.session.id ? { ...s, ...clean } : s)));
      toast('Session updated');
    } else {
      setStudySessions((l) => [...l, { id: uid(), ...clean }]);
      logActivity(`Planned a ${clean.subject} session`);
      toast('Session added');
    }
    close();
  };

  const colorOf = (name) => subjects.find((s) => s.name === name)?.color;
  const weekTotal = studySessions
    .filter((s) => days.some((d) => format(d, DATE_FMT) === s.date))
    .reduce((sum, s) => sum + minutesBetween(s.start, s.end), 0);

  return (
    <>
      <PageHeader
        title="Study Planner"
        subtitle={`${format(days[0], 'd MMM')} to ${format(days[6], 'd MMM yyyy')}. ${(weekTotal / 60).toFixed(1)} hours planned.`}
        action={<button type="button" className="btn-primary" onClick={() => setModal({ open: true, session: null, date: today })}><Plus size={18} /> Add session</button>}
      />
      <div className="mb-5 flex items-center gap-2">
        <button type="button" className="icon-btn border border-slate-200 dark:border-line" onClick={() => setOffset((o) => o - 1)} aria-label="Previous week"><ChevronLeft size={18} /></button>
        <button type="button" className="btn-ghost !py-1.5" onClick={() => setOffset(0)} disabled={offset === 0}>This week</button>
        <button type="button" className="icon-btn border border-slate-200 dark:border-line" onClick={() => setOffset((o) => o + 1)} aria-label="Next week"><ChevronRight size={18} /></button>
      </div>

      {studySessions.length === 0 && (
        <div className="card mb-4 flex items-center gap-3 text-sm"><CalendarDays size={18} className="text-brand-600" /> No sessions planned yet. Use "Add session" or the plus button on a day.</div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {days.map((d) => {
          const key = format(d, DATE_FMT);
          const list = studySessions.filter((s) => s.date === key).sort((a, b) => a.start.localeCompare(b.start));
          return (
            <div key={key} className={`rounded-2xl border p-3 ${key === today ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-200 bg-white/60 dark:border-line dark:bg-surface/60'}`}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{format(d, 'EEEE')}</p>
                  <p className="muted text-xs">{format(d, 'd MMM')}</p>
                </div>
                <button type="button" className="icon-btn" onClick={() => setModal({ open: true, session: null, date: key })} aria-label={`Add session on ${format(d, 'EEEE')}`}><Plus size={16} /></button>
              </div>
              <div className="space-y-2">
                {list.length === 0 && <p className="muted py-3 text-center text-xs">Free day</p>}
                {list.map((s) => (
                  <StudySessionCard key={s.id} session={s} color={colorOf(s.subject)} onEdit={(session) => setModal({ open: true, session, date: session.date })} onDelete={setDel} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal.open} title={modal.session ? 'Edit study session' : 'Add study session'} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Subject" error={err.subject}>
            <input className="input" list="subject-list" value={f.subject} onChange={set('subject')} placeholder="e.g. DBMS" autoFocus />
            <datalist id="subject-list">{subjects.map((s) => <option key={s.id} value={s.name} />)}</datalist>
          </Field>
          <Field label="Date" error={err.date}><input type="date" className="input" value={f.date} onChange={set('date')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start time"><input type="time" className="input" value={f.start} onChange={set('start')} /></Field>
            <Field label="End time" error={err.end}><input type="time" className="input" value={f.end} onChange={set('end')} /></Field>
          </div>
          <Field label="Notes"><textarea className="input min-h-20" value={f.notes} onChange={set('notes')} placeholder="What will you cover?" /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary">{modal.session ? 'Save changes' : 'Add session'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!del} title="Delete session" message={`Delete the ${del?.subject} session?`}
        onConfirm={() => { setStudySessions((l) => l.filter((s) => s.id !== del.id)); toast('Session deleted'); setDel(null); }}
        onCancel={() => setDel(null)}
      />
    </>
  );
}
