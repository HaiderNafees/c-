import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../context/AuthContext'
import { TOTAL_TOPICS } from '../../data/syllabus'

/* ============================================================
   Navbar
   Top navigation bar.
   - Logo + brand (always)
   - Public: Sign in / Sign up
   - Authenticated: Dashboard / Progress links, progress %, points, logout
   - Theme toggle (always)
   ============================================================ */

export default function Navbar() {
  const { user, isAuthenticated, progress, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const completed = progress?.lecturesCompleted.length ?? 0
  const points = progress?.totalPoints ?? 0
  const pct = TOTAL_TOPICS > 0 ? Math.round((completed / TOTAL_TOPICS) * 100) : 0

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const isActive = (path) => location.pathname === path

  return (
    <header
      className="sticky top-0 z-50 w-full theme-transition"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--surface-border)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: 'var(--color-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
            aria-hidden="true"
          >
            C++
          </div>
          <span
            className="font-semibold text-base hidden sm:inline"
            style={{ color: 'var(--text-heading)' }}
          >
            C++ Learning
          </span>
        </Link>

        {/* Center nav links (authenticated only) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/progress" active={isActive('/progress')}>
              Progress
            </NavLink>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Progress pill */}
              <div
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-body)',
                  border: '1px solid var(--surface-border)',
                }}
                title="Lectures completed"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-success)' }}
                  aria-hidden="true"
                />
                <span>
                  {completed}/{TOTAL_TOPICS} · {pct}%
                </span>
              </div>

              {/* Points pill */}
              <div
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-body)',
                  border: '1px solid var(--surface-border)',
                }}
                title="Total points"
              >
                <span>{points} pts</span>
              </div>

              {/* User avatar */}
              <div
                className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-white text-sm font-semibold"
                style={{ background: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: 'transparent',
                  color: 'var(--text-body)',
                  border: '1px solid var(--surface-border)',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
                style={{ color: 'var(--text-body)' }}
              >
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 18px' }}>
                Sign up
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

/** Styled nav link that highlights when active. */
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
      style={{
        background: active
          ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
          : 'transparent',
        color: active ? 'var(--color-primary)' : 'var(--text-body)',
      }}
    >
      {children}
    </Link>
  )
}
