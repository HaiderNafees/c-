import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  createEmptyProgress,
  loadProgress,
  saveProgress,
  todayISO,
} from '../hooks/useProgress'

/* ============================================================
   AuthContext
   Global user session + progress state — backed by Supabase.

   Responsibilities:
     - signup / login / logout (Supabase Auth)
     - Restore session on page load (Supabase session)
     - Load the logged-in user's progress from the cloud
     - Expose updateProgress() so any component can mutate +
       auto-save to Supabase
   ============================================================ */

const AuthContext = createContext(undefined)

/** Derive a display name from an email (part before @). */
function displayNameFromEmail(email) {
  if (!email) return 'User'
  return email.split('@')[0]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { id, email, username } | null
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true) // true until session restored

  /** Load progress for the given user id from Supabase. */
  const fetchProgress = useCallback(async (userId) => {
    const saved = await loadProgress(userId)
    if (saved) {
      // Refresh lastLogin on resume.
      const refreshed = { ...saved, lastLogin: todayISO() }
      saveProgress(userId, refreshed) // fire-and-forget
      setProgress(refreshed)
    } else {
      // No progress row yet — create an empty one.
      const fresh = createEmptyProgress(userId)
      saveProgress(userId, fresh) // fire-and-forget
      setProgress(fresh)
    }
  }, [])

  // On mount: restore the Supabase session if one exists.
  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!active) return

      if (error || !data.user) {
        setLoading(false)
        return
      }

      const u = data.user
      setUser({
        id: u.id,
        email: u.email,
        username: displayNameFromEmail(u.email),
      })
      await fetchProgress(u.id)
      if (active) setLoading(false)
    }

    restoreSession()

    // Listen for auth state changes (login / logout / token refresh).
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!active) return
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProgress(null)
          setLoading(false)
          return
        }
        if (session?.user) {
          const u = session.user
          setUser({
            id: u.id,
            email: u.email,
            username: displayNameFromEmail(u.email),
          })
          await fetchProgress(u.id)
          setLoading(false)
        }
      },
    )

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [fetchProgress])

  /** Create a new account with Supabase Auth and log in. */
  const signup = useCallback(async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !password) {
      return { ok: false, error: 'Email and password are required.' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    })

    if (error) {
      return { ok: false, error: error.message }
    }

    // If email confirmation is required, the session will be null.
    if (!data.session) {
      return {
        ok: true,
        needsConfirmation: true,
        error: 'Check your email to verify your account.',
      }
    }

    // Session exists — user is auto-logged in. The onAuthStateChange
    // listener will load their progress.
    return { ok: true }
  }, [])

  /** Verify credentials against Supabase Auth and load progress. */
  const login = useCallback(async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !password) {
      return { ok: false, error: 'Email and password are required.' }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      return { ok: false, error: 'Invalid credentials.' }
    }

    // onAuthStateChange will set user + progress automatically.
    return { ok: true }
  }, [])

  /** Clear the Supabase session. */
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProgress(null)
  }, [])

  /**
   * Merge updates into the current progress and persist to Supabase.
   * Accepts either a partial object or an updater function.
   * Optimistic: state updates immediately; cloud save runs async.
   */
  const updateProgress = useCallback((updater) => {
    setProgress((prev) => {
      if (!prev) return prev
      const patch =
        typeof updater === 'function' ? updater(prev) : updater
      const next = { ...prev, ...patch }
      saveProgress(prev.username, next) // fire-and-forget to Supabase
      return next
    })
  }, [])

  const value = {
    user,
    progress,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProgress,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
