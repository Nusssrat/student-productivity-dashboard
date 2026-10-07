import { NavLink } from 'react-router-dom';
import {
  BarChart3, BookOpen, CalendarClock, CalendarDays, CheckSquare, Flame, GraduationCap,
  LayoutDashboard, Settings, StickyNote, Timer, X,
} from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';

const ICONS = {
  '/': LayoutDashboard, '/tasks': CheckSquare, '/planner': CalendarDays, '/subjects': BookOpen,
  '/pomodoro': Timer, '/deadlines': CalendarClock, '/notes': StickyNote, '/habits': Flame,
  '/analytics': BarChart3, '/settings': Settings,
};

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-slate-200 bg-white p-4 transition-transform dark:border-line dark:bg-surface lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><GraduationCap size={20} /></div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold">Study Desk</p>
              <p className="muted text-xs">Productivity dashboard</p>
            </div>
          </div>
          <button type="button" className="icon-btn lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.to];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
