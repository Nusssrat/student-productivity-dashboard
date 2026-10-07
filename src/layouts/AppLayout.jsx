import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Toast from '../components/Toast';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
}
