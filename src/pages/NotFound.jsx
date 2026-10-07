import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 flex max-w-md flex-col items-center py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-100"><Compass size={26} /></div>
      <h2 className="font-display text-2xl font-bold">Page not found</h2>
      <p className="muted mt-1 text-sm">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-5">Back to dashboard</Link>
    </div>
  );
}
