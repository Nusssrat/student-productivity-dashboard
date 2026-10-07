import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Planner from './pages/Planner';
import Subjects from './pages/Subjects';
import Pomodoro from './pages/Pomodoro';
import Deadlines from './pages/Deadlines';
import Notes from './pages/Notes';
import Habits from './pages/Habits';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
