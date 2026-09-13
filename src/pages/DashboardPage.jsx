import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SYLLABUS, TOTAL_TOPICS } from '../data/syllabus'

/* ============================================================
   DashboardPage (PROTECTED)
   - Welcome message
   - Large progress ring (% completed)
   - Stats: Lectures Done / Total Points / Started On
   - "Continue Learning" card → first incomplete topic
   - Recent activity
   ============================================================ */

export default function DashboardPage() {
  const { user, progress } = useAuth()

  const completed = progress?.lecturesCompleted ?? []
  const completedSet = new Set(completed)
  const completedCount = completed.length
  const points = progress?.totalPoints ?? 0
  const startedOn = progress?.startedOn ?? '—'

  const pct = TOTAL_TOPICS > 0 ? Math.round((completedCount / TOTAL_TOPICS) * 100) : 0

  // First incomplete topic (for "Continue Learning").
  const nextTopic = SYLLABUS.find((t) => !completedSet.has(t.id))

  // Recent activity: completed lectures in reverse order (latest first).
  const recent = [...completed].reverse().slice(0, 5).map((id) => {
    const topic = SYLLABUS.find((t) => t.id === id)
    return topic
  })

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 page-fade">
      {/* Greeting */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight mb-1"
          style={{ color: 'var(--text-heading)' }}
        >
          Welcome back, {user?.username}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Pick up where you left off and keep mastering C++.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: progress ring + stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress ring card */}
          <div className="surface-card p-6 flex flex-col items-center">
            <ProgressRing percent={pct} />
            <div
              className="mt-4 text-sm font-medium"
              style={{ color: 'var(--text-body)' }}
            >
              {completedCount} of {TOTAL_TOPICS} lectures completed
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4">
            <StatRow label="Lectures Done" value={`${completedCount} / ${TOTAL_TOPICS}`} color="var(--color-primary)" />
            <StatRow label="Total Points" value={points} color="var(--color-success)" />
            <StatRow label="Started On" value={startedOn} color="var(--color-accent)" />
          </div>
        </div>

        {/* Right column: continue learning + recent activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          {nextTopic ? (
            <Link
              to={`/lectures/${nextTopic.id}`}
              className="glass-card p-6 block transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Continue Learning
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    {nextTopic.title}
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {nextTopic.description}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden="true"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </div>
              </div>
            </Link>
          ) : (
            <div className="glass-card p-6 text-center">
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--text-heading)' }}
              >
                All topics completed
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Great job finishing the syllabus.
              </p>
            </div>
          )}

          {/* Recent activity */}
          <div className="surface-card p-6">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-heading)' }}
            >
              Recent Activity
            </h2>
            {recent.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                No lectures completed yet. Start learning from the syllabus!
              </p>
            ) : (
              <ul className="space-y-2">
                {recent.map((topic) =>
                  topic ? (
                    <li
                      key={topic.id}
                      className="flex items-center gap-3 py-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--color-success)' }}
                        aria-hidden="true"
                      />
                      <Link
                        to={`/lectures/${topic.id}`}
                        className="text-sm transition-colors duration-200 hover:underline"
                        style={{ color: 'var(--text-body)' }}
                      >
                        {topic.title}
                      </Link>
                      <span
                        className="ml-auto text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {topic.module}
                      </span>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

/* ---------- Progress ring (SVG) ---------- */
function ProgressRing({ percent }) {
  const size = 140
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  // Animate the displayed number from 0 → target on mount.
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const duration = 800
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * percent))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [percent])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-secondary)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms ease-in-out' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color: 'var(--text-heading)' }}
        >
          {display}%
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          complete
        </span>
      </div>
    </div>
  )
}

/* ---------- Stat row ---------- */
function StatRow({ label, value, color }) {
  return (
    <div className="surface-card p-4 flex items-center gap-3">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: color }}
        aria-hidden="true"
      />
      <div className="flex-1">
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {label}
        </div>
        <div
          className="text-lg font-semibold"
          style={{ color: 'var(--text-heading)' }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
