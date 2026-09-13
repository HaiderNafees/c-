import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

/* ============================================================
   LoginForm
   Email + password -> authenticate via Supabase Auth.
   On success the AuthContext loads the user's progress; the
   parent route will redirect away from /login.
   ============================================================ */

export default function LoginForm() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error)
      showToast(result.error, 'error')
      setSubmitting(false)
    } else {
      showToast('Welcome back', 'success')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl outline-none text-[0.95rem] theme-transition"
          style={{
            background: 'var(--surface-secondary)',
            color: 'var(--text-heading)',
            border: '1px solid var(--surface-border)',
          }}
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl outline-none text-[0.95rem] theme-transition"
          style={{
            background: 'var(--surface-secondary)',
            color: 'var(--text-heading)',
            border: '1px solid var(--surface-border)',
          }}
        />
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
            color: 'var(--color-warning)',
            border: '1px solid color-mix(in srgb, var(--color-warning) 30%, transparent)',
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={submitting}
      >
        {submitting ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  )
}
