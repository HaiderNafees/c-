import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

/* ============================================================
   SignupForm
   Create a new account with Supabase Auth (email + password).
   On success the user is auto-logged-in and an EMPTY progress
   record is created in the cloud.
   ============================================================ */

export default function SignupForm() {
  const { signup } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      showToast('Passwords do not match.', 'error')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      showToast('Password must be at least 6 characters.', 'error')
      return
    }

    setSubmitting(true)
    const result = await signup(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      showToast(result.error, 'error')
      return
    }

    if (result.needsConfirmation) {
      // Email confirmation required — show message, don't auto-redirect.
      setError(result.error)
      showToast(result.error, 'info')
      return
    }

    showToast('Account created', 'success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Email Address
        </label>
        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password (min 6 characters)"
          autoComplete="new-password"
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
          htmlFor="signup-confirm"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-heading)' }}
        >
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter password"
          autoComplete="new-password"
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
        {submitting ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
