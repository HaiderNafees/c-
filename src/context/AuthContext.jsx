import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import {
  createEmptyProgress,
  loadProgress,
  saveProgress,
  todayISO,
} from '../hooks/useProgress'

/* ============================================================
   AuthContext
   Global user session + progress state — pure frontend,
   persisted to localStorage (no backend required).

   localStorage keys:
     cpp-users    Map of email -> { password, username }
     cpp-session  Email of the currently logged-in user

   Responsibilities:
     - signup / login / logout (local credential check)
     - Restore session on page load
     - Load the logged-in user's progress from localStorage
     - Expose updateProgress() so any component can mutate +
       persist to localStorage
   ============================================================ */

const AuthContext = createContext(undefined)

const USERS_KEY = 'cpp-users'
const SESSION_KEY = 'cpp-session'

/** Read the stored users map (email -> { password, username }). */
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Persist the users map to localStorage. */
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** Derive a display name from an email (part before @). */
function displayNameFromEmail(email) {
  if (!email) return 'User'
  return email.split('@')[0]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { id, email, username } | null
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true) // true until session restored

  /** Load (or create) progress for the given storage key from localStorage. */
  const fetchProgress = useCallback((userKey) => {
    const saved = loadProgress(userKey)
    if (saved) {
      // Refresh lastLogin on resume.
      const refreshed = { ...saved, lastLogin: todayISO() }
      saveProgress(userKey, refreshed)
      setProgress(refreshed)
    } else {
      // No progress yet — create an empty one.
      const fresh = createEmptyProgress(userKey)
      saveProgress(userKey, fresh)
      setProgress(fresh)
    }
  }, [])

  // On mount: restore the local session if one exists.
  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY)
    if (email) {
      const record = readUsers()[email]
      if (record) {
        setUser({
          id: email,
          email,
          username: record.username || displayNameFromEmail(email),
        })
        fetchProgress(email)
      }
    }
    setLoading(false)
  }, [fetchProgress])

  /** Create a new account locally and log in. */
  const signup = useCallback(
    async (email, password) => {
      const cleanEmail = email.trim().toLowerCase()

      if (!cleanEmail || !password) {
        return { ok: false, error: 'Email and password are required.' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' }
      }

      const users = readUsers()
      if (users[cleanEmail]) {
        return { ok: false, error: 'An account with this email already exists.' }
      }

      const username = displayNameFromEmail(cleanEmail)
      users[cleanEmail] = { password, username }
      writeUsers(users)
      localStorage.setItem(SESSION_KEY, cleanEmail)

      setUser({ id: cleanEmail, email: cleanEmail, username })
      fetchProgress(cleanEmail)
      return { ok: true }
    },
    [fetchProgress],
  )

  /** Verify credentials against locally stored accounts and load progress. */
  const login = useCallback(
    async (email, password) => {
      const cleanEmail = email.trim().toLowerCase()

      if (!cleanEmail || !password) {
        return { ok: false, error: 'Email and password are required.' }
      }

      const record = readUsers()[cleanEmail]
      if (!record || record.password !== password) {
        return { ok: false, error: 'Invalid credentials.' }
      }

      localStorage.setItem(SESSION_KEY, cleanEmail)
      setUser({
        id: cleanEmail,
        email: cleanEmail,
        username: record.username || displayNameFromEmail(cleanEmail),
      })
      fetchProgress(cleanEmail)
      return { ok: true }
    },
    [fetchProgress],
  )

  /** Clear the local session. */
  const logout = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setProgress(null)
  }, [])

  /**
   * Merge updates into the current progress and persist to localStorage.
   * Accepts either a partial object or an updater function.
   * Optimistic: state updates immediately; save runs synchronously after.
   */
  const updateProgress = useCallback((updater) => {
    setProgress((prev) => {
      if (!prev) return prev
      const patch =
        typeof updater === 'function' ? updater(prev) : updater
      const next = { ...prev, ...patch }
      saveProgress(prev.username, next) // fire-and-forget to localStorage
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
