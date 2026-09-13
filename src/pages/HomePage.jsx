import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ============================================================
   HomePage (PUBLIC) — Apple Store style landing
   - Large hero headline
   - Sign in / Sign up CTAs
   - Feature highlights
   - No auth required
   ============================================================ */

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="flex-1 w-full page-fade">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(1200px 600px at 50% -10%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <p
            className="text-sm font-medium tracking-wide uppercase mb-4 fade-up"
            style={{ color: 'var(--color-primary)', animationDelay: '0ms' }}
          >
            C++ Learning & Course Companion
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 fade-up"
            style={{ color: 'var(--text-heading)', animationDelay: '80ms' }}
          >
            Learn C++.
            <br />
            <span style={{ color: 'var(--text-muted)' }}>The right way.</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 fade-up"
            style={{ color: 'var(--text-muted)', animationDelay: '160ms' }}
          >
            31 structured lectures, hands-on exercises, and auto-graded
            quizzes — designed for university students and self-learners.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 fade-up"
            style={{ animationDelay: '240ms' }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-primary">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-secondary">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Feature grid ---------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            title="31 Lectures"
            desc="From basics to STL, structured across five progressive modules."
          />
          <FeatureCard
            title="Exercises"
            desc="Three levels per topic — easy, medium, and university-exam — with solutions."
          />
          <FeatureCard
            title="Quizzes"
            desc="Five questions per lecture with instant feedback, explanations, and scoring."
          />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer
        className="border-t py-8 text-center text-xs"
        style={{
          borderColor: 'var(--surface-border)',
          color: 'var(--text-muted)',
        }}
      >
        <p>Built for self-learners and students preparing for university exams.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} C++ Learning App.</p>
      </footer>
    </main>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div className="surface-card p-6">
      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: 'var(--text-heading)' }}
      >
        {title}
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {desc}
      </p>
    </div>
  )
}
