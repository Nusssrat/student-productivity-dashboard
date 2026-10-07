import { useEffect, useState } from 'react';
import Modal from './Modal';
import Field from './Field';
import { PRIORITIES, TASK_CATEGORIES } from '../utils/constants';
import { todayStr } from '../utils/helpers';

const blank = () => ({ title: '', category: 'Study', priority: 'medium', due: todayStr() });

export default function TaskModal({ open, task, onClose, onSave }) {
  const [f, setF] = useState(blank());
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    setF(task ? { title: task.title, category: task.category, priority: task.priority, due: task.due || '' } : blank());
    setErr('');
  }, [open, task]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim()) { setErr('Enter a task title.'); return; }
    onSave({ ...f, title: f.title.trim() });
  };

  return (
    <Modal open={open} title={task ? 'Edit task' : 'Add task'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Title" error={err}>
          <input className="input" value={f.title} onChange={set('title')} placeholder="e.g. Complete OS lab record" autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select className="input" value={f.category} onChange={set('category')}>
              {TASK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={f.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Due date">
          <input type="date" className="input" value={f.due} onChange={set('due')} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{task ? 'Save changes' : 'Add task'}</button>
        </div>
      </form>
    </Modal>
  );
}
