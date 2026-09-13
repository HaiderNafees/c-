import { createContext, useContext, useEffect, useState, useCallback } from 'react'

/* ============================================================
   ThemeContext
   - Manages light / dark mode
   - Auto-detects system preference on first visit
   - Persists user choice to localStorage
   - Applies `.dark` class to <html> element
   ============================================================ */

const ThemeContext = createContext(undefined)

const STORAGE_KEY = 'cpp-learning-theme'

/**
 * Get the initial theme for the app.
 * Priority: saved localStorage value > system preference > 'light'
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch (err) {
    // localStorage may be unavailable (private mode, etc.) — fall through.
  }

  // Auto-detect system preference on first visit.
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }

  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply the theme to the document root and persist it.
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Persist preference to localStorage.
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch (err) {
      // Ignore write errors (e.g. private browsing).
    }
  }, [theme])

  // Toggle between light and dark.
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

/**
 * Hook to access the current theme and toggle function.
 * Must be used inside a <ThemeProvider>.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
