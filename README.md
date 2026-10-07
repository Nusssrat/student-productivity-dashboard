# Student Productivity Dashboard

A frontend-only productivity app for college students. Plan study sessions, track tasks, deadlines, habits and notes, run Pomodoro focus sessions, and see analytics. All data lives in your browser's `localStorage`, so there is no backend or database.

## Features

- **Dashboard**: greeting, today's tasks, study time, productivity score, daily goal ring, upcoming exams and deadlines, weekly chart, recent activity
- **Tasks**: add, edit, delete, complete; priority, due date, category; search, filters (All, Pending, Completed, High Priority), sorting
- **Study Planner**: Monday to Sunday calendar view, week navigation, add/edit/delete sessions
- **Subjects**: progress rings, study hours, completed and remaining topics, add/edit/delete
- **Pomodoro**: start, pause, reset, custom durations, session stats; keeps running while you browse other pages; completed focus time feeds the dashboard, analytics and the chosen subject
- **Exams & Deadlines**: countdowns ("DBMS Exam in 12 days"), Upcoming, Today, Tomorrow and Overdue filters
- **Notes**: create, edit, delete, search, pin, categories
- **Habits**: streaks, best streak, weekly completion, 12-week heatmap
- **Analytics**: weekly study hours, task completion, subject distribution, productivity trend, habit completion (all computed from stored data)
- **Settings**: light/dark mode, study goal, Pomodoro durations, export data as JSON, clear all data

## Screenshots

_Add screenshots here (dashboard, tasks, planner, analytics, dark mode)._

## Tech stack

React 18, Vite, JavaScript, Tailwind CSS 3, React Router 6, Recharts, Lucide React, date-fns.

## Folder structure

```text
student-productivity-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/favicon.svg
└── src/
    ├── main.jsx            entry point, seeds demo data on first launch
    ├── App.jsx             routes
    ├── index.css           Tailwind layers and shared classes
    ├── components/         Sidebar, Header, StatCard, TaskCard, TaskModal, SubjectCard,
    │                       StudySessionCard, NoteCard, ExamCard, HabitCard, PomodoroTimer,
    │                       ProgressRing, SearchBar, FilterBar, EmptyState, ConfirmDialog,
    │                       Toast, Modal, Field, PageHeader
    ├── pages/              Dashboard, Tasks, Planner, Subjects, Pomodoro, Deadlines,
    │                       Notes, Habits, Analytics, Settings, NotFound
    ├── layouts/            AppLayout (sidebar + header + outlet)
    ├── context/            AppContext (state, toasts, Pomodoro engine)
    ├── hooks/              useLocalStorage
    ├── utils/              storage.js, helpers.js, stats.js, constants.js
    ├── data/               demo.js (first-launch sample data)
    └── assets/
```

## Installation and running

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). To create a production build, run `npm run build`, then `npm run preview`.

## localStorage architecture

- `src/utils/storage.js` is the **only** file that calls `localStorage`. Keys are prefixed with `spd:`.
- `src/hooks/useLocalStorage.js` is a `useState` replacement that reads from and writes to `storage.js`.
- `AppContext` owns one `useLocalStorage` state per key, and pages read from it.

| Key | Contents |
|---|---|
| `tasks` | title, category, priority, due, done, createdAt, completedOn |
| `subjects` | name, totalTopics, doneTopics, hours, color |
| `studySessions` | subject, date, start, end, notes |
| `notes` | title, category, body, pinned, updatedAt |
| `habits` | name, log (`{ 'yyyy-MM-dd': true }`) |
| `exams` | title, subject, type, date, time, description |
| `pomodoroSettings` | focus and break minutes |
| `userPreferences` | name, daily goal (hours) |
| `theme` | `light` or `dark` |
| `focusLog` | per-day focus minutes and sessions (`{ date: { m, s } }`) |
| `activity` | latest 30 activity entries |

On first launch (no `spd:initialized` flag) demo data is written. After "Clear All Data" the app stays empty. "Load demo data" restores the samples.

### How scores are calculated

Daily score = 40% study-goal progress + 30% habits completed + 30% tasks (due that day, or completed that day). The dashboard "Productivity" figure is the average of the last 7 daily scores.

## Future improvements

- Import data from a JSON export
- Browser notifications for deadlines and Pomodoro completion
- Drag-and-drop planner and task reordering
- Recurring tasks and study sessions
- Installable PWA with offline support
- Optional cloud sync
