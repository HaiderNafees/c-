import { Link, useLocation } from 'react-router-dom'
import { SYLLABUS, MODULES } from '../../data/syllabus'
import { useAuth } from '../../context/AuthContext'

/* ============================================================
   Sidebar
   Syllabus navigation — all 31 topics grouped by module.
   - Green dot for completed, gray dot for pending
   - Highlights the currently active topic
   - Scrollable, glass-effect background
   ============================================================ */

export default function Sidebar() {
  const location = useLocation()
  const { progress } = useAuth()

  const completed = new Set(progress?.lecturesCompleted ?? [])

  // Extract the active topic id from the URL (/lectures/<id>).
  const activeId = location.pathname.startsWith('/lectures/')
    ? location.pathname.split('/lectures/')[1]
    : null

  return (
    <aside
      className="glass-card h-full overflow-y-auto p-4 w-64 shrink-0"
      style={{ borderRadius: '16px' }}
    >
      <h2
        className="text-sm font-semibold uppercase tracking-wide mb-4 px-2"
        style={{ color: 'var(--text-muted)' }}
      >
        Syllabus
      </h2>

      {MODULES.map((mod) => {
        const moduleLabel = mod.name.split('— ')[1] || mod.name
        const topics = SYLLABUS.filter((t) => t.module === moduleLabel)
        if (topics.length === 0) return null

        return (
          <div key={mod.id} className="mb-5">
            <div
              className="text-xs font-semibold mb-2 px-2"
              style={{ color: 'var(--color-accent)' }}
            >
              {mod.name}
            </div>
            <ul className="space-y-0.5">
              {topics.map((topic) => {
                const isDone = completed.has(topic.id)
                const isActive = activeId === topic.id

                return (
                  <li key={topic.id}>
                    <Link
                      to={`/lectures/${topic.id}`}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all duration-200"
                      style={{
                        background: isActive
                          ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
                          : 'transparent',
                        color: isActive
                          ? 'var(--color-primary)'
                          : 'var(--text-body)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: isDone
                            ? 'var(--color-success)'
                            : 'var(--surface-border)',
                        }}
                        aria-hidden="true"
                      />
                      <span className="leading-tight">{topic.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}
