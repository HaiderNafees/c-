# 📘 C++ Learning & Course Companion

> React + Vite + Tailwind CSS app — a university-aligned C++ course with a structured syllabus, hands-on exercises, auto-graded quizzes, user accounts, and personal progress tracking. Pure frontend — everything runs in the browser and deploys to Vercel with zero backend.

---

## ✨ Features

- ✅ **31 structured lectures** — across 5 modules (Basics, Core C++, OOP, Advanced, STL)
- ✅ **3-level exercises per topic** — 🟢 Easy → 🟡 Medium → 🔴 University-Exam, each with a collapsible solution
- ✅ **5-question quizzes per lecture** — Multiple Choice / Predict Output / Find the Error, with instant feedback, explanations, and animated score
- ✅ **User accounts & personal progress tracking** — every user gets a saved progress JSON in the browser
- ✅ **Light / Dark theme** — Apple-inspired premium design, auto-detects system preference, persists across reloads
- ✅ **Dashboard** — animated progress ring, stats, "Continue Learning" card, recent activity
- ✅ **Progress page** — overall bar, per-module breakdown, full topic checklist, quiz scores
- ✅ **Syntax-highlighted code blocks** with one-click Copy and line numbers
- ✅ **Toast notifications** for signup, login, exercise & quiz completion
- ✅ **Fully responsive** — desktop sidebar, tablet compact, mobile slide-in drawer
- ✅ **Works offline** — pure frontend, no server required
- ✅ **Deployable to Vercel in 1 click**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

---

## 🛠 Tech Stack

| Area        | Choice                          |
| ----------- | ------------------------------- |
| Framework   | React 18                        |
| Build tool  | Vite 6                          |
| Styling     | Tailwind CSS 4 (Vite plugin)    |
| Routing     | react-router-dom 6              |
| State       | React Context + `localStorage`  |
| Deployment  | Vercel (zero backend)           |

---

## 📁 Project Structure

```
src/
├── main.jsx                  # Entry point — Router + Theme + Toast + Auth providers
├── App.jsx                   # Root layout + routes + ProtectedRoute wrapper
├── index.css                 # Tailwind 4 directives + CSS color variables + animations
├── data/
│   ├── syllabus.js           # All 31 topics (5 modules) — easy to edit
│   ├── exercises.js          # 3 exercises per topic (easy/medium/exam)
│   └── quizzes.js            # 5 quiz questions per topic
├── components/
│   ├── Layout/
│   │   ├── ThemeToggle.jsx   # Apple-style theme switch
│   │   ├── Navbar.jsx        # Top nav: brand, links, progress %, points, logout
│   │   └── Sidebar.jsx       # Syllabus navigation grouped by module
│   ├── Content/
│   │   ├── LectureViewer.jsx # Topic content: notes, code, exercises, quiz
│   │   ├── CodeBlock.jsx     # Dark syntax-highlighted code with copy button
│   │   ├── Exercise.jsx      # Single exercise + collapsible solution
│   │   ├── ExerciseList.jsx  # All 3 exercises per topic
│   │   ├── Quiz.jsx          # 5-question quiz engine + score
│   │   └── QuizQuestion.jsx  # Individual question UI with feedback
│   └── Auth/
│       ├── LoginForm.jsx     # Login form (verifies credentials)
│       └── SignupForm.jsx    # Signup form (creates account + empty progress)
├── context/
│   ├── ThemeContext.jsx      # Theme state + localStorage persistence
│   ├── AuthContext.jsx       # User session + progress state (signup/login/logout)
│   └── ToastContext.jsx      # Global toast notification system
├── hooks/
│   └── useProgress.js        # localStorage storage layer + progress helpers
└── pages/
    ├── LoginPage.jsx         # Tabbed glass-card (Login ↔ Signup)
    ├── DashboardPage.jsx     # Progress ring, stats, continue learning, recent activity
    ├── LecturePage.jsx       # /lectures/:topicId — content + sidebar (responsive)
    └── ProgressPage.jsx      # Overall + per-module progress, topic list, quiz scores
```

---

## 🎨 Design System

Colors are defined as CSS variables in `src/index.css` and switch automatically when the `.dark` class is applied to `<html>`.

| Token            | Light       | Dark        |
| ---------------- | ----------- | ----------- |
| Primary Blue     | `#0071E3`   | `#0A84FF`   |
| Accent Indigo    | `#5E5CE6`   | `#5E5CE6`   |
| Success Green    | `#34C759`   | `#30D158`   |
| Warning Orange   | `#FF9500`   | `#FF9F0A`   |
| Heading text     | `#1D1D1F`   | `#F5F5F7`   |
| Body text        | `#424245`   | `#E0E0E2`   |

**Fonts:** SF Pro Display stack for UI, SF Mono / Consolas for code.
**Style:** Glass-morphism cards, `rounded-xl` corners, soft shadows, 300ms ease transitions.

---

## 🌓 Theming

1. **Before paint** — an inline script in `index.html` reads `localStorage` (or the system preference) and applies `.dark` to `<html>` if needed, preventing a flash of the wrong theme.
2. **Runtime** — `ThemeContext` toggles the `.dark` class on `document.documentElement`.
3. **Persistence** — every change is saved under the key `cpp-learning-theme`.

---

## 🔐 Authentication & Progress

### localStorage keys

| Key                    | Value                                            |
| ---------------------- | ------------------------------------------------ |
| `cpp-users`            | `{ username: { password, createdOn } }`          |
| `cpp-progress-<name>`  | Per-user progress JSON (see model below)         |
| `cpp-current-user`     | Username of the active session                   |

### Progress data model

```json
{
  "username": "string",
  "startedOn": "YYYY-MM-DD",
  "lastLogin": "YYYY-MM-DD",
  "lecturesCompleted": ["topic-id-here"],
  "exercisesCompleted": { "topic-id": [1, 2, 3] },
  "quizScores": { "topic-id": 85 },
  "totalPoints": 0
}
```

### How it works

1. **Signup** — credentials saved to `cpp-users`, an empty progress object is created, and the session starts.
2. **Login** — credentials verified, then the user's existing progress JSON is loaded into state.
3. **Auto-save** — every mutation goes through `AuthContext.updateProgress()`, writing to `localStorage` instantly.
4. **Session restore** — on page load, `AuthContext` reads `cpp-current-user` and reloads that user's progress.
5. **Logout** — the session key is cleared; progress JSON stays on disk and is restored on next login.

### Protected routes

`App.jsx` wraps dashboard, lecture, and progress pages in a `<ProtectedRoute>`. Unauthenticated users are redirected to `/login`.

> ⚠️ **Security note:** Passwords are stored in **plain text** in `localStorage`. This is fine for an educational/demo app but must never be used in production. Add a real backend with hashed passwords before going live.

---

## 📱 Responsive Design

- **Desktop (> 1024px):** full persistent sidebar + spacious 2-column layout.
- **Tablet (768–1024px):** compact layout, adaptive cards.
- **Mobile (< 768px):** sidebar collapses into a slide-in drawer opened by a floating ☰ button; all content reflows to a single column with no horizontal scrolling.

---

## ✏️ Adding Content

To extend the syllabus, exercises, or quizzes, edit the data files in `src/data/`:

- **Topics:** add an entry to `src/data/syllabus.js` (`{ id, title, module, description }`).
- **Exercises:** add an array to `src/data/exercises.js` keyed by topic id — 3 entries (`easy`, `medium`, `exam`), each with `task` and `solution`.
- **Quizzes:** add an array to `src/data/quizzes.js` keyed by topic id — 5 objects each with `question`, `options[]`, `correctIndex`, and `explanation`.

No other code changes are needed — components read from these files automatically.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite. `vercel.json` sets the build command and SPA route rewrites.
4. Click **Deploy**.

No environment variables or backend required.

---

## 📝 Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start dev server with HMR          |
| `npm run build`   | Production build to `dist/`        |
| `npm run preview` | Preview the production build       |

---

## 🗺 Roadmap

- **Part 1** ✅ — Design system, light/dark theme, glass-morphism UI
- **Part 2** ✅ — Authentication, protected routes, per-user progress tracking
- **Part 3** ✅ — 31-topic syllabus, sidebar, lecture pages, dashboard, progress page
- **Part 4** ✅ — Exercises (3 levels), quizzes (5 questions), syntax-highlighted code blocks
- **Part 5** ✅ — Final polish: responsive mobile drawer, toast notifications, animated counters, page transitions, hover effects, deployment config, full documentation

---

## License

MIT
