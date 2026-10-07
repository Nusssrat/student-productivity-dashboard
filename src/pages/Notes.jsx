import { useEffect, useMemo, useState } from 'react';
import { Plus, StickyNote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import Field from '../components/Field';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { NOTE_CATEGORIES } from '../utils/constants';
import { uid } from '../utils/helpers';

const FILTERS = [{ value: 'all', label: 'All' }, ...NOTE_CATEGORIES.map((c) => ({ value: c, label: c }))];
const blank = () => ({ title: '', category: 'DBMS', body: '' });

export default function Notes() {
  const { notes, setNotes, toast, logActivity } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, note: null });
  const [f, setF] = useState(blank());
  const [err, setErr] = useState({});
  const [del, setDel] = useState(null);

  useEffect(() => {
    if (!modal.open) return;
    setF(modal.note ? { title: modal.note.title, category: modal.note.category, body: modal.note.body } : blank());
    setErr({});
  }, [modal]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => (filter === 'all' ? true : n.category === filter))
      .filter((n) => (q ? `${n.title} ${n.body} ${n.category}`.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, query, filter]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const close = () => setModal({ open: false, note: null });

  const submit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!f.title.trim()) errors.title = 'Enter a title.';
    if (!f.body.trim()) errors.body = 'Write something in the note.';
    setErr(errors);
    if (Object.keys(errors).length) return;
    const data = { title: f.title.trim(), category: f.category, body: f.body.trim(), updatedAt: new Date().toISOString() };
    if (modal.note) {
      setNotes((l) => l.map((n) => (n.id === modal.note.id ? { ...n, ...data } : n)));
      toast('Note updated');
    } else {
      setNotes((l) => [{ id: uid(), pinned: false, ...data }, ...l]);
      logActivity(`Created note "${data.title}"`);
      toast('Note created');
    }
    close();
  };

  const pin = (id) => setNotes((l) => l.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  return (
    <>
      <PageHeader
        title="Notes"
        subtitle="Quick notes for every subject. Pinned notes stay on top."
        action={<button type="button" className="btn-primary" onClick={() => setModal({ open: true, note: null })}><Plus size={18} /> New note</button>}
      />
      <div className="mb-5 space-y-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search notes" />
        <FilterBar options={FILTERS} value={filter} onChange={setFilter} />
      </div>
      {visible.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={notes.length ? 'No notes match your search' : 'No notes yet'}
          text={notes.length ? 'Try another keyword or category.' : 'Create a note to keep formulas, definitions and reminders handy.'}
          action={notes.length ? null : { label: 'New note', onClick: () => setModal({ open: true, note: null }) }}
        />
      ) : (
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {visible.map((n) => <NoteCard key={n.id} note={n} onPin={pin} onEdit={(note) => setModal({ open: true, note })} onDelete={setDel} />)}
        </div>
      )}

      <Modal open={modal.open} title={modal.note ? 'Edit note' : 'New note'} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title" error={err.title}><input className="input" value={f.title} onChange={set('title')} autoFocus /></Field>
          <Field label="Category">
            <select className="input" value={f.category} onChange={set('category')}>{NOTE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <Field label="Note" error={err.body}><textarea className="input min-h-40" value={f.body} onChange={set('body')} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
            <button type="submit" className="btn-primary">{modal.note ? 'Save changes' : 'Create note'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!del} title="Delete note" message={`Delete "${del?.title}"?`}
        onConfirm={() => { setNotes((l) => l.filter((n) => n.id !== del.id)); toast('Note deleted'); setDel(null); }}
        onCancel={() => setDel(null)}
      />
    </>
  );
}
