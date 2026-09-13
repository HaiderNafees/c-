import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/Auth/LoginForm'
import SignupForm from '../components/Auth/SignupForm'

/* ============================================================
   LoginPage
   Centered glass-card with Login <-> Signup tabs.
   /login  -> login tab
   /signup -> signup tab
   If already authenticated, redirect to home.
   ============================================================ */

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const [tab, setTab] = useState(location.pathname === '/signup' ? 'signup' : 'login')

  // Keep the tab in sync when navigating between /login and /signup.
  useEffect(() => {
    setTab(location.pathname === '/signup' ? 'signup' : 'login')
  }, [location.pathname])

  // Once session restore finishes, send logged-in users home.
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand heading */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white font-bold text-2xl mb-5"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              boxShadow: 'var(--shadow-lg)',
            }}
            aria-hidden="true"
          >
            C++
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: 'var(--text-heading)' }}
          >
            C++ Learning
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Sign in to track your progress.
          </p>
        </div>

        {/* Glass card with tabs */}
        <div className="glass-card p-8">
          {/* Tab switcher */}
          <div
            className="flex p-1 rounded-xl mb-6"
            style={{ background: 'var(--surface-secondary)' }}
            role="tablist"
          >
            <TabButton
              active={tab === 'login'}
              onClick={() => setTab('login')}
            >
              Log In
            </TabButton>
            <TabButton
              active={tab === 'signup'}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </TabButton>
          </div>

          {/* Form panel — cross-fade between tabs */}
          <div
            key={tab}
            style={{
              animation: 'fadeIn 300ms ease-in-out',
            }}
          >
            {tab === 'login' ? <LoginForm /> : <SignupForm />}
          </div>

          <p
            className="text-xs text-center mt-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Your progress is securely saved to the cloud and synced across devices.
          </p>
        </div>
      </div>

      {/* Inline keyframe for the tab cross-fade */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}

/** Small segmented-control tab button. */
function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300"
      style={{
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--text-heading)' : 'var(--text-muted)',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
