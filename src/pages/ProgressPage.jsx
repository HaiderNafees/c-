import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SYLLABUS, MODULES, TOTAL_TOPICS } from '../data/syllabus'

/* ============================================================
   ProgressPage (PROTECTED)
   - Overall progress bar
   - Per-module completion stats
   - All topics list (green / gray dot status)
   - Quiz scores summary
   ============================================================ */

export default function ProgressPage() {
  const { progress } = useAuth()

  const completed = new Set(progress?.lecturesCompleted ?? [])
  const quizScores = progress?.quizScores ?? {}
  const completedCount = completed.size
  const pct = TOTAL_TOPICS > 0 ? Math.round((completedCount / TOTAL_TOPICS) * 100) : 0

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 page-fade">
      <h1
        className="text-3xl font-bold tracking-tight mb-1"
        style={{ color: 'var(--text-heading)' }}
      >
        Your Progress
      </h1>
      <p style={{ color: 'var(--text-muted)' }} className="mb-8">
        Track your journey through the C++ syllabus.
      </p>

      {/* Overall progress bar */}
      <div className="surface-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--text-heading)' }}
          >
            Overall Completion
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {completedCount} / {TOTAL_TOPICS} ({pct}%)
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ background: 'var(--surface-secondary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            }}
          />
        </div>
      </div>

      {/* Per-module stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MODULES.map((mod) => {
          const moduleLabel = mod.name.split('— ')[1] || mod.name
          const topics = SYLLABUS.filter((t) => t.module === moduleLabel)
          const done = topics.filter((t) => completed.has(t.id)).length
          const total = topics.length
          const modPct = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <div key={mod.id} className="surface-card p-5">
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text-heading)' }}
              >
                {moduleLabel}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {modPct}%
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ({done}/{total})
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-secondary)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${modPct}%`,
                    background: 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* All topics list */}
      <div className="surface-card p-6 mb-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-heading)' }}
        >
          All Topics
        </h2>
        <div className="space-y-5">
          {MODULES.map((mod) => {
            const moduleLabel = mod.name.split('— ')[1] || mod.name
            const topics = SYLLABUS.filter((t) => t.module === moduleLabel)
            if (topics.length === 0) return null

            return (
              <div key={mod.id}>
                <div
                  className="text-xs font-semibold mb-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {mod.name}
                </div>
                <ul className="space-y-1">
                  {topics.map((topic) => {
                    const isDone = completed.has(topic.id)
                    return (
                      <li key={topic.id}>
                        <Link
                          to={`/lectures/${topic.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-secondary)]"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              background: isDone
                                ? 'var(--color-success)'
                                : 'var(--surface-border)',
                            }}
                            aria-hidden="true"
                          />
                          <span
                            className="text-sm"
                            style={{
                              color: isDone
                                ? 'var(--text-muted)'
                                : 'var(--text-body)',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}
                          >
                            {topic.title}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quiz scores summary */}
      <div className="surface-card p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-heading)' }}
        >
          Quiz Scores
        </h2>
        {Object.keys(quizScores).length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>
            No quiz scores yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(quizScores).map(([topicId, score]) => {
              const topic = SYLLABUS.find((t) => t.id === topicId)
              return (
                <li
                  key={topicId}
                  className="flex items-center justify-between py-2"
                >
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-body)' }}
                  >
                    {topic?.title ?? topicId}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color:
                        score >= 80
                          ? 'var(--color-success)'
                          : score >= 60
                            ? 'var(--color-warning)'
                            : 'var(--color-primary)',
                    }}
                  >
                    {score}%
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
