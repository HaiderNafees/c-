import { useState } from 'react'
import CodeBlock from './CodeBlock'

/* ============================================================
   Exercise
   A single exercise with:
   - Level badge (Easy / Medium / Exam) with colored dot
   - Task description
   - Collapsible "Show Solution" accordion (smooth animation)
   - Mark as completed button

   Props:
     exercise: { level, task, solution }
     index: number (position in the list, used for completion tracking)
     isCompleted: boolean
     onComplete: () => void
   ============================================================ */

const LEVEL_STYLES = {
  easy: { label: 'Easy', color: 'var(--color-success)' },
  medium: { label: 'Medium', color: 'var(--color-warning)' },
  exam: { label: 'Exam', color: 'var(--color-danger)' },
}

export default function Exercise({ exercise, index, isCompleted, onComplete }) {
  const [open, setOpen] = useState(false)
  const style = LEVEL_STYLES[exercise.level] || LEVEL_STYLES.easy

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface-secondary)',
        border: isCompleted
          ? '1px solid color-mix(in srgb, var(--color-success) 40%, transparent)'
          : '1px solid var(--surface-border)',
        transition: 'border-color 300ms ease-in-out',
      }}
    >
      {/* Header: badge + task + actions */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: `color-mix(in srgb, ${style.color} 15%, transparent)`,
              color: style.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: style.color }}
              aria-hidden="true"
            />
            {style.label}
          </span>

          {isCompleted && (
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--color-success)' }}
            >
              Completed
            </span>
          )}
        </div>

        <p
          className="text-sm mb-3"
          style={{ color: 'var(--text-body)' }}
        >
          <strong>Exercise {index + 1}:</strong> {exercise.task}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: 'var(--surface)',
              color: 'var(--color-primary)',
              border: '1px solid var(--surface-border)',
            }}
            aria-expanded={open}
          >
            {open ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                Hide Solution
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                Show Solution
              </>
            )}
          </button>

          {!isCompleted && (
            <button
              type="button"
              onClick={onComplete}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
              style={{
                background: 'var(--color-success)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Solution accordion — smooth expand/collapse using grid-rows trick */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-4 pb-4">
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Solution:
            </div>
            <CodeBlock code={exercise.solution} />
          </div>
        </div>
      </div>
    </div>
  )
}
