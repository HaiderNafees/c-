import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getTopicById, SYLLABUS } from '../data/syllabus'
import LectureViewer from '../components/Content/LectureViewer'
import Sidebar from '../components/Layout/Sidebar'

/* ============================================================
   LecturePage  (/lectures/:topicId)
   Loads a topic based on the URL and renders the LectureViewer.
   Includes the Sidebar for syllabus navigation.
   - Desktop (lg+): persistent sidebar
   - Mobile/Tablet: hamburger button opens a slide-in drawer
   ============================================================ */

export default function LecturePage() {
  const { topicId } = useParams()
  const location = useLocation()
  const topic = getTopicById(topicId)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Find previous/next topics for navigation footer.
  const index = SYLLABUS.findIndex((t) => t.id === topicId)
  const prev = index > 0 ? SYLLABUS[index - 1] : null
  const next = index < SYLLABUS.length - 1 ? SYLLABUS[index + 1] : null

  if (!topic) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="surface-card p-8 text-center">
          <h1
            className="text-xl font-bold mb-2"
            style={{ color: 'var(--text-heading)' }}
          >
            Topic not found
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="mb-4">
            The topic “{topicId}” doesn't exist.
          </p>
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex gap-6 page-fade">
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{
          background: 'var(--color-primary)',
        }}
        aria-label="Open syllabus menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Desktop sidebar */}
      <div
        className="hidden lg:block sticky top-20 self-start"
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div
            className="absolute left-0 top-0 h-full w-72 max-w-[85%] p-4"
            style={{
              background: 'var(--surface)',
              animation: 'toastIn 300ms ease-out',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--text-heading)' }}
              >
                Syllabus
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Lecture content */}
      <div className="flex-1 min-w-0">
        <LectureViewer topic={topic} />

        {/* Prev / Next navigation */}
        <div className="flex justify-between gap-3 mt-6">
          {prev ? (
            <Link
              to={`/lectures/${prev.id}`}
              className="surface-card px-4 py-3 flex-1 max-w-xs transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ← Previous
              </div>
              <div
                className="text-sm font-medium truncate"
                style={{ color: 'var(--text-heading)' }}
              >
                {prev.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1 max-w-xs" />
          )}
          {next ? (
            <Link
              to={`/lectures/${next.id}`}
              className="surface-card px-4 py-3 flex-1 max-w-xs text-right transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Next →
              </div>
              <div
                className="text-sm font-medium truncate"
                style={{ color: 'var(--text-heading)' }}
              >
                {next.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1 max-w-xs" />
          )}
        </div>
      </div>
    </main>
  )
}
