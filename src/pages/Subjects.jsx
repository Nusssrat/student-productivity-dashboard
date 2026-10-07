import { useEffect, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import SubjectCard from '../components/SubjectCard';
import Modal from '../components/Modal';
import Field from '../components/Field';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { SUBJECT_COLORS } from '../utils/constants';
import { uid } from '../utils/helpers';

const blank = () => ({ name: '', totalTopics: 10, doneTopics: 0, hours: 0 });

export default function Subjects() {
  const { subjects, setSubjects, toast, logActivity } = useApp();
  const [modal, setModal] = useState({ open: false, subject: null });
  const [f, setF] = useState(blank());
  const [err, setErr] = useState({});
  const [del, setDel] = useState(null);

  useEffect(() => {
    if (!modal.open) return;
    setF(modal.subject ? { name: modal.subject.name, totalTopics: modal.subject.totalTopics, doneTopics: modal.subject.doneTopics, hours: modal.subject.hours } : blank());
    setErr({});
  }, [modal]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const close = () => setModal({ open: false, subject: null });

  const submit = (e) => {
    e.preventDefault();
    const total = Number(f.totalTopics);
    const done = Number(f.doneTopics);
    const hours = Number(f.hours);
    const errors = {};
    if (!f.name.trim()) errors.name = 'Enter a subject name.';
    if (!Number.isInteger(total) || total < 1) errors.totalTopics = 'Enter at least 1 topic.';
    if (!Number.isInteger(done) || done < 0 || done > total) errors.doneTopics = 'Completed topics must be between 0 and the total.';
    if (Number.isNaN(hours) || hours < 0) errors.hours = 'Hours cannot be negative.';
    setErr(errors);
    if (Object.keys(errors).length) return;
    const data = { name: f.name.trim(), totalTopics: total, doneTopics: done, hours };
    if (modal.subject) {
      setSubjects((l) => l.map((s) => (s.id === modal.subject.id ? { ...s, ...data } : s)));
      toast('Subject updated');
    } else {
      setSubjects((l) => [...l, { id: uid(), color: SUBJECT_COLORS[l.length % SUBJECT_COLORS.length], ...data }]);
      logActivity(`Added subject "${data.name}"`);
      toast('Subject added');
    }
    close();
  };

  const step = (id, delta) =>
    setSubjects((l) => l.map((s) => (s.id === id ? { ...s, doneTopics: Math.max(0, Math.min(s.totalTopics, s.doneTopics + delta)) } : s)));

  return (
    <>
      <PageHeader
        title="Subjects"
        subtitle="Track topics covered and hours studied for each subject."
        action={<button type="button" className="btn-primary" onClick={() => setModal({ open: true, subject: null })}><Plus size={18} /> Add subject</button>}
      />
      {subjects.length === 0 ? (
        <EmptyState icon={BookOpen} title="No subjects yet" text="Add the subjects you are studying this semester." action={{ label: 'Add subject', onClick: () => setModal({ open: true, subject: null }) }} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} onStep={step} onEdit={(subject) => setModal({ open: true, subject })} onDelete={setDel} />
          ))}
        </div>
      )}

      <Modal open={modal.open} title={modal.subject ? 'Edit subject' : 'Add subject'} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Subject name" error={err.name}><input className="input" value={f.name} onChange={set('name')} placeholder="e.g. Compiler Design" autoFocus /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total topics" error={err.totalTopics}><input type="number" min="1" className="input" value={f.totalTopics} onChange={set('totalTopics')} /></Field>
            <Field label="Completed topics" error={err.doneTopics}><input type="number" min="0" className="input" value={f.doneTopics} onChange={set('doneTopics')} /></Field>
          </div>
          <Field label="Study hours" error={err.hours}><input type="number" min="0" step="0.5" className="input" value={f.hours} onChange={set('hours')} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary">{modal.subject ? 'Save changes' : 'Add subject'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!del} title="Delete subject" message={`Delete "${del?.name}" and its progress?`}
        onConfirm={() => { setSubjects((l) => l.filter((s) => s.id !== del.id)); toast('Subject deleted'); setDel(null); }}
        onCancel={() => setDel(null)}
      />
    </>
  );
}
