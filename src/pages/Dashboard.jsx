import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Gauge, ListChecks } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import ExamCard from '../components/ExamCard';
import EmptyState from '../components/EmptyState';
import { byDateTime, daysFromToday, fmtHours, lastNDays, todayStr } from '../utils/helpers';
import { minutesOn, weeklyAverage } from '../utils/stats';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { tasks, exams, focusLog, habits, activity, userPreferences, toggleTask } = useApp();
  const today = todayStr();
  const goalMin = userPreferences.dailyGoal * 60;
  const todayMin = minutesOn(focusLog, today);
  const goalPct = goalMin ? Math.min(100, Math.round((todayMin / goalMin) * 100)) : 0;

  const todayTasks = tasks.filter((t) => t.due === today);
  const todayDone = todayTasks.filter((t) => t.done).length;
  const totalDone = tasks.filter((t) => t.done).length;
  const productivity = weeklyAverage({ tasks, habits, focusLog, goalHours: userPreferences.dailyGoal });

  const chart = lastNDays(7).map((d) => ({ day: format(parseISO(d), 'EEE'), hours: +(minutesOn(focusLog, d) / 60).toFixed(1) }));
  const upcoming = exams.filter((e) => daysFromToday(e.date) >= 0).sort(byDateTime);
  const upExams = upcoming.filter((e) => e.type === 'Exam').slice(0, 3);
  const upOther = upcoming.filter((e) => e.type !== 'Exam').slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{greeting()}, {userPreferences.name}</h2>
        <p className="muted mt-1 text-sm">{format(new Date(), 'EEEE, d MMMM yyyy')}. You have {todayTasks.length - todayDone} task{todayTasks.length - todayDone === 1 ? '' : 's'} left for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ListChecks} label="Today's tasks" value={`${todayDone}/${todayTasks.length}`} hint="Due today, completed" />
        <StatCard icon={CheckCircle2} label="Completed tasks" value={totalDone} hint={`${tasks.length} in total`} tone="teal" />
        <StatCard icon={Clock} label="Study time today" value={fmtHours(todayMin)} hint={`Goal ${userPreferences.dailyGoal}h`} tone="amber" />
        <StatCard icon={Gauge} label="Productivity" value={`${productivity}%`} hint="Average of the last 7 days" tone="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Weekly study chart</h3>
          <p className="muted mb-4 text-sm">Focus hours over the last 7 days</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} width={28} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#94a3b822' }} formatter={(v) => [`${v} h`, 'Study']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="hours" fill="#3b4cca" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <h3 className="font-display text-lg font-bold">Daily goal</h3>
          <p className="muted mb-4 text-sm">{fmtHours(todayMin)} of {userPreferences.dailyGoal}h studied</p>
          <ProgressRing value={goalPct} size={150} stroke={13}>
            <span className="font-display text-3xl font-bold">{goalPct}%</span>
          </ProgressRing>
          <Link to="/pomodoro" className="btn-primary mt-5">Start a focus session</Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Today's tasks</h3>
            <Link to="/tasks" className="text-sm font-semibold text-brand-600 dark:text-brand-100">All tasks</Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="muted text-sm">Nothing due today. Add a task to plan your day.</p>
          ) : (
            <ul className="space-y-2">
              {todayTasks.map((t) => (
                <li key={t.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 hover:bg-slate-50 dark:hover:bg-white/5">
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="h-4 w-4 accent-brand-600" />
                    <span className={`text-sm font-medium ${t.done ? 'muted line-through' : ''}`}>{t.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold">Upcoming exams</h3>
          {upExams.length ? upExams.map((e) => <ExamCard key={e.id} item={e} compact />) : <p className="muted text-sm">No upcoming exams.</p>}
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold">Upcoming deadlines</h3>
          {upOther.length ? upOther.map((e) => <ExamCard key={e.id} item={e} compact />) : <p className="muted text-sm">No upcoming deadlines.</p>}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-display text-lg font-bold">Recent activity</h3>
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" text="Complete a task, habit or focus session and it will show up here." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-line">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="font-medium">{a.text}</span>
                <span className="muted shrink-0 text-xs">{formatDistanceToNow(parseISO(a.at), { addSuffix: true })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
