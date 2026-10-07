import { addDays, format } from 'date-fns';
import { DATE_FMT, uid, weekDays } from '../utils/helpers';
import { SUBJECT_COLORS } from '../utils/constants';

const day = (offset) => format(addDays(new Date(), offset), DATE_FMT);

export function createDemoData() {
  const subjectSeed = [
    ['Data Structures', 24, 15, 18.5],
    ['DBMS', 20, 11, 12],
    ['Operating Systems', 22, 9, 8.5],
    ['Computer Networks', 18, 6, 5],
    ['Software Engineering', 16, 10, 7.5],
    ['Computer Organization', 20, 5, 4],
    ['Digital Logic', 15, 12, 9],
  ];
  const subjects = subjectSeed.map(([name, totalTopics, doneTopics, hours], i) => ({
    id: uid() + i, name, totalTopics, doneTopics, hours, color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
  }));

  const tasks = [
    { title: 'Finish DBMS normalization worksheet', category: 'Assignment', priority: 'high', due: day(0), done: false },
    { title: 'Revise process scheduling algorithms', category: 'Study', priority: 'medium', due: day(0), done: true, completedOn: day(0) },
    { title: 'Prepare mini-project report draft', category: 'Project', priority: 'high', due: day(3), done: false },
    { title: 'Solve 5 linked list problems', category: 'Study', priority: 'medium', due: day(1), done: false },
    { title: 'Book train tickets for semester break', category: 'Personal', priority: 'low', due: day(-1), done: false },
  ].map((t, i) => ({ id: uid() + i, createdAt: new Date().toISOString(), completedOn: null, ...t }));

  const week = weekDays();
  const sessionSeed = [
    ['Data Structures', 0, '18:00', '19:30', 'Trees and traversals'],
    ['DBMS', 1, '17:00', '18:30', 'ER diagrams and normal forms'],
    ['Operating Systems', 3, '19:00', '20:30', 'Deadlock detection'],
    ['Computer Networks', 5, '10:00', '12:00', 'Subnetting practice set'],
  ];
  const studySessions = sessionSeed.map(([subject, d, start, end, notes], i) => ({
    id: uid() + i, subject, date: format(week[d], DATE_FMT), start, end, notes,
  }));

  const habitSeed = [
    ['Study 2 hours', 1], ['Read', 2], ['Exercise', 3], ['Revise', 4], ['Coding Practice', 5],
  ];
  const habits = habitSeed.map(([name, seed], i) => {
    const log = {};
    for (let back = 1; back <= 84; back += 1) {
      if ((back * seed + i) % 4 !== 3 && (back * 3 + seed) % 7 !== 0) log[day(-back)] = true;
    }
    return { id: uid() + i, name, log };
  });

  const noteSeed = [
    ['Normal forms cheat sheet', 'DBMS', 'Quick rules: 1NF no repeating groups, 2NF no partial dependency, 3NF no transitive dependency, BCNF every determinant is a candidate key.', true],
    ['Round robin scheduling', 'OS', 'Time quantum too large behaves like FCFS; too small causes heavy context-switch overhead. Practice average waiting time numericals.', false],
    ['TCP vs UDP', 'CN', 'TCP: connection-oriented, reliable, ordered. UDP: connectionless, low latency. Remember DNS and streaming use UDP.', false],
    ['Binary search tree operations', 'DSA', 'Insert and search are O(h). Deletion has three cases: leaf, one child, two children (use inorder successor).', true],
    ['Library card and ID renewal', 'College', 'Renew the library card before the 30th. Carry two passport photos and the previous card to the front desk.', false],
  ];
  const notes = noteSeed.map(([title, category, body, pinned], i) => ({
    id: uid() + i, title, category, body, pinned, updatedAt: new Date(Date.now() - i * 3600e3).toISOString(),
  }));

  const exams = [
    { title: 'DBMS Exam', subject: 'DBMS', type: 'Exam', date: day(12), time: '10:00', description: 'Units 1 to 4. Bring hall ticket and ID card.' },
    { title: 'Operating Systems Assignment', subject: 'Operating Systems', type: 'Assignment', date: day(4), time: '23:59', description: 'Submit the scheduling simulation write-up on the portal.' },
    { title: 'Mini Project Review', subject: 'Software Engineering', type: 'Project', date: day(1), time: '14:30', description: 'First review with the guide: SRS and design document.' },
  ].map((e, i) => ({ id: uid() + i, ...e }));

  const focusLog = {};
  [[6, 100], [5, 75], [4, 125], [3, 50], [2, 150], [1, 100]].forEach(([back, m]) => {
    focusLog[day(-back)] = { m, s: Math.round(m / 25) };
  });

  const activity = [
    { text: 'Completed task "Revise process scheduling algorithms"', ago: 1 },
    { text: 'Completed a 25-min focus session', ago: 3 },
    { text: 'Added exam "DBMS Exam"', ago: 20 },
  ].map((a, i) => ({ id: uid() + i, text: a.text, at: new Date(Date.now() - a.ago * 3600e3).toISOString() }));

  return {
    tasks, subjects, studySessions, notes, habits, exams, focusLog, activity,
    pomodoroSettings: { focus: 25, break: 5 },
    userPreferences: { name: 'Student', dailyGoal: 4 },
    theme: 'light',
  };
}
