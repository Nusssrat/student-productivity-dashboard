import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Gauge, Target } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { DATE_FMT, daysFromToday, fmtHours, lastNDays, weekDays } from '../utils/helpers';
import { dayScore, minutesOn, weeklyAverage } from '../utils/stats';

const TICK = { fill: '#94a3b8', fontSize: 12 };
const TIP = { borderRadius: 12, fontSize: 12 };

function ChartCard({ title, subtitle, empty, children }) {
  return (
    <div className="card">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="muted mb-4 text-sm">{subtitle}</p>
      <div className="h-64">
        {empty ? (
          <div className="muted grid h-full place-items-center text-center text-sm">{empty}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { tasks, subjects, habits, focusLog, userPreferences } = useApp();
  const data = { tasks, habits, focusLog, goalHours: userPreferences.dailyGoal };

  const entries = Object.values(focusLog);
  const totalMin = entries.reduce((s, v) => s + v.m, 0);
  const totalSessions = entries.reduce((s, v) => s + v.s, 0);
  const done = tasks.filter((t) => t.done).length;
  const overdue = tasks.filter((t) => !t.done && t.due && daysFromToday(t.due) < 0).length;
  const pending = tasks.length - done - overdue;
  const completionRate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const week = weekDays().map((d) => ({
    day: format(d, 'EEE'), hours: +(minutesOn(focusLog, format(d, DATE_FMT)) / 60).toFixed(1),
  }));
  const taskData = [
    { name: 'Completed', value: done, color: '#0f9d8a' },
    { name: 'Pending', value: pending, color: '#3b4cca' },
    { name: 'Overdue', value: overdue, color: '#e11d48' },
  ].filter((x) => x.value > 0);
  const subjectData = subjects.filter((s) => s.hours > 0).map((s) => ({ name: s.name, value: +s.hours.toFixed(1), color: s.color }));
  const trend = lastNDays(14).map((d) => ({ day: format(parseISO(d), 'd MMM'), score: dayScore(data, d) }));
  const last7 = lastNDays(7);
  const habitData = habits.map((h) => ({ name: h.name, rate: Math.round((last7.filter((d) => h.log[d]).length / 7) * 100) }));

  return (
    <>
      <PageHeader title="Analytics" subtitle="Every chart is calculated from your saved data." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} label="Total focus time" value={fmtHours(totalMin)} />
        <StatCard icon={Target} label="Focus sessions" value={totalSessions} tone="amber" />
        <StatCard icon={CheckCircle2} label="Task completion" value={`${completionRate}%`} tone="teal" />
        <StatCard icon={Gauge} label="7-day productivity" value={`${weeklyAverage(data)}%`} tone="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Weekly study hours" subtitle="Focus time, Monday to Sunday">
          <BarChart data={week}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={TICK} />
            <YAxis tickLine={false} axisLine={false} width={28} tick={TICK} />
            <Tooltip cursor={{ fill: '#94a3b822' }} formatter={(v) => [`${v} h`, 'Study']} contentStyle={TIP} />
            <Bar dataKey="hours" fill="#3b4cca" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Task completion" subtitle="Completed, pending and overdue tasks" empty={taskData.length ? null : 'Add tasks to see completion.'}>
          <PieChart>
            <Pie data={taskData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {taskData.map((x) => <Cell key={x.name} fill={x.color} />)}
            </Pie>
            <Tooltip contentStyle={TIP} />
            <Legend iconType="circle" />
          </PieChart>
        </ChartCard>

        <ChartCard title="Subject study distribution" subtitle="Hours studied per subject" empty={subjectData.length ? null : 'Log focus sessions against a subject to see this chart.'}>
          <PieChart>
            <Pie data={subjectData} dataKey="value" nameKey="name" outerRadius={85}>
              {subjectData.map((x) => <Cell key={x.name} fill={x.color} />)}
            </Pie>
            <Tooltip formatter={(v) => [`${v} h`, 'Studied']} contentStyle={TIP} />
            <Legend iconType="circle" />
          </PieChart>
        </ChartCard>

        <ChartCard title="Productivity trend" subtitle="Daily score over 14 days (study goal, habits, tasks)">
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={TICK} interval={2} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} tick={TICK} />
            <Tooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={TIP} />
            <Line type="monotone" dataKey="score" stroke="#3b4cca" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title="Habit completion" subtitle="Share of the last 7 days each habit was completed" empty={habitData.length ? null : 'Add habits to see completion.'}>
            <BarChart data={habitData} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b833" />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={TICK} unit="%" />
              <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={TICK} />
              <Tooltip cursor={{ fill: '#94a3b822' }} formatter={(v) => [`${v}%`, 'Completed']} contentStyle={TIP} />
              <Bar dataKey="rate" fill="#0f9d8a" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </>
  );
}
