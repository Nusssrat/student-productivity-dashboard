import { useMemo, useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { uid } from '../utils/helpers';
import { PRIORITIES } from '../utils/constants';

const FILTERS = [
  { value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' }, { value: 'high', label: 'High Priority' },
];
const RANK = Object.fromEntries(PRIORITIES.map((p, i) => [p.value, i]));

export default function Tasks() {
  const { tasks, setTasks, toggleTask, toast, logActivity } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('due');
  const [modal, setModal] = useState({ open: false, task: null });
  const [del, setDel] = useState(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => (q ? `${t.title} ${t.category}`.toLowerCase().includes(q) : true))
      .filter((t) => {
        if (filter === 'pending') return !t.done;
        if (filter === 'completed') return t.done;
        if (filter === 'high') return t.priority === 'high';
        return true;
      })
      .sort((a, b) => {
        if (sort === 'priority') return RANK[a.priority] - RANK[b.priority];
        if (sort === 'recent') return b.createdAt.localeCompare(a.createdAt);
        return (a.due || '9999').localeCompare(b.due || '9999');
      });
  }, [tasks, query, filter, sort]);

  const save = (form) => {
    if (modal.task) {
      setTasks((l) => l.map((t) => (t.id === modal.task.id ? { ...t, ...form } : t)));
      toast('Task updated');
    } else {
      setTasks((l) => [{ id: uid(), done: false, completedOn: null, createdAt: new Date().toISOString(), ...form }, ...l]);
      logActivity(`Added task "${form.title}"`);
      toast('Task added');
    }
    setModal({ open: false, task: null });
  };

  const remove = () => {
    setTasks((l) => l.filter((t) => t.id !== del.id));
    toast('Task deleted');
    setDel(null);
  };

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.filter((t) => !t.done).length} pending, ${tasks.filter((t) => t.done).length} completed`}
        action={<button type="button" className="btn-primary" onClick={() => setModal({ open: true, task: null })}><Plus size={18} /> Add task</button>}
      />
      <div className="mb-5 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1"><SearchBar value={query} onChange={setQuery} placeholder="Search tasks" /></div>
          <select className="input sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
            <option value="due">Sort by due date</option>
            <option value="priority">Sort by priority</option>
            <option value="recent">Recently added</option>
          </select>
        </div>
        <FilterBar options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={tasks.length ? 'No tasks match your filters' : 'No tasks yet'}
          text={tasks.length ? 'Try a different search or filter.' : 'Add your first task to start planning your week.'}
          action={tasks.length ? null : { label: 'Add task', onClick: () => setModal({ open: true, task: null }) }}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggleTask} onEdit={(task) => setModal({ open: true, task })} onDelete={setDel} />
          ))}
        </div>
      )}

      <TaskModal open={modal.open} task={modal.task} onClose={() => setModal({ open: false, task: null })} onSave={save} />
      <ConfirmDialog open={!!del} title="Delete task" message={`Delete "${del?.title}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </>
  );
}
