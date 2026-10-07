import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../utils/constants';
import { fmtClock } from '../utils/helpers';

export default function Header({ onMenu }) {
  const { pathname } = useLocation();
  const { theme, setTheme, timer } = useApp();
  const title = NAV_ITEMS.find((n) => n.to === pathname)?.title || 'Not found';

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-paper/85 px-4 py-3 backdrop-blur dark:border-line dark:bg-night/85 sm:px-6 lg:px-8">
      <button type="button" className="icon-btn lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold">{title}</p>
        <p className="muted hidden text-xs sm:block">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
      </div>
      {timer.running && (
        <Link to="/pomodoro" className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold tabular-nums text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
          <Timer size={15} /> {fmtClock(timer.remaining)}
        </Link>
      )}
      <button
        type="button"
        className="icon-btn !h-9 !w-9"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
