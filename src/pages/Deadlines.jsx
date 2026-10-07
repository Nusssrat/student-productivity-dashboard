import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ExamCard from '../components/ExamCard';
import Modal from '../components/Modal';
import Field from '../components/Field';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { EXAM_TYPES } from '../utils/constants';
import { byDateTime, countdown, todayStr, uid } from '../utils/helpers';

const FILTERS = [
  { value: 'all', label: 'All' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' }, { value: 'overdue', label: 'Overdue' },
];
const blank = () => ({ title: '', subject: '', type: 'Exam', date: todayStr(), time: '10:00', description: '' });

export default function Deadlines() {
  const { exams, setExams, subjects, toast, logActivity } = useApp();
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, item: null });
  const [f, setF] = useState(blank());
  const [err, setErr] = useState({});
  const [del, setDel] = useState(null);

  useEffect(() => {
    if (!modal.open) return;
    setF(modal.item ? { ...blank(), ...modal.item } : blank());
    setErr({});
  }, [modal]);

  const list = useMemo(
    () => [...exams].sort(byDateTime).filter((e) => filter === 'all' || countdown(e).status === filter),
    [exams, filter],
  );

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const close = () => setModal({ open: false, item: null });

  const submit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!f.title.trim()) errors.title = 'Enter a title.';
    if (!f.date) errors.date = 'Pick a date.';
    setErr(errors);
    if (Object.keys(errors).length) return;
    const data = { ...f, title: f.title.trim(), description: f.description.trim() };
    if (modal.item) {
      setExams((l) => l.map((x) => (x.id === modal.item.id ? { ...x, ...data } : x)));
      toast('Updated');
    } else {
      setExams((l) => [{ id: uid(), ...data }, ...l]);
      logActivity(`Added ${data.type.toLowerCase()} "${data.title}"`);
      toast(`${data.type} added`);
    }
    close();
  };

  return (
    <>
      <PageHeader
        title="Exams & Deadlines"
        subtitle="Never miss a date. Countdowns update automatically."
        action={<button type="button" className="btn-primary" onClick={() => setModal({ open: true, item: null })}><Plus size={18} /> Add deadline</button>}
      />
      <div className="mb-5"><FilterBar options={FILTERS} value={filter} onChange={setFilter} /></div>
      {list.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={exams.length ? 'Nothing in this view' : 'No exams or deadlines yet'}
          text={exams.length ? 'Try another filter.' : 'Add your next exam, assignment or project deadline.'}
          action={exams.length ? null : { label: 'Add deadline', onClick: () => setModal({ open: true, item: null }) }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((x) => <ExamCard key={x.id} item={x} onEdit={(item) => setModal({ open: true, item })} onDelete={setDel} />)}
        </div>
      )}

      <Modal open={modal.open} title={modal.item ? 'Edit deadline' : 'Add deadline'} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title" error={err.title}><input className="input" value={f.title} onChange={set('title')} placeholder="e.g. DBMS Exam" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className="input" value={f.type} onChange={set('type')}>{EXAM_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Subject">
              <input className="input" list="deadline-subjects" value={f.subject} onChange={set('subject')} placeholder="Optional" />
              <datalist id="deadline-subjects">{subjects.map((s) => <option key={s.id} value={s.name} />)}</datalist>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" error={err.date}><input type="date" className="input" value={f.date} onChange={set('date')} /></Field>
            <Field label="Time"><input type="time" className="input" value={f.time} onChange={set('time')} /></Field>
          </div>
          <Field label="Description"><textarea className="input min-h-20" value={f.description} onChange={set('description')} placeholder="Syllabus, venue, submission link" /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary">{modal.item ? 'Save changes' : 'Add deadline'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!del} title="Delete deadline" message={`Delete "${del?.title}"?`}
        onConfirm={() => { setExams((l) => l.filter((x) => x.id !== del.id)); toast('Deleted'); setDel(null); }}
        onCancel={() => setDel(null)}
      />
    </>
  );
}
