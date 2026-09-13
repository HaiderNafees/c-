import { useTheme } from '../../context/ThemeContext'

/* ============================================================
   ThemeToggle
   Apple-style switch that toggles between light and dark mode.
   Uses CSS variables from index.css so it adapts to the
   current theme automatically.
   ============================================================ */

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex items-center justify-center w-12 h-7 rounded-full cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        background: isDark ? 'var(--color-primary)' : 'var(--surface-secondary)',
        border: '1px solid var(--surface-border)',
        transition: 'background-color 300ms ease-in-out',
      }}
    >
      {/* Track glow */}
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 12px ${isDark ? 'var(--color-primary)' : 'transparent'}`,
          opacity: isDark ? 0.3 : 0,
        }}
        aria-hidden="true"
      />

      {/* Sun icon (light mode indicator) */}
      <svg
        className="absolute left-1.5 w-3.5 h-3.5 transition-opacity duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          color: 'var(--warning, #ff9500)',
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* Moon icon (dark mode indicator) */}
      <svg
        className="absolute right-1.5 w-3.5 h-3.5 transition-opacity duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          color: '#ffffff',
        }}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Sliding knob */}
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        style={{
          transform: isDark ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 300ms ease-in-out',
          boxShadow: 'var(--shadow-sm)',
        }}
        aria-hidden="true"
      >
        {/* Knob inner icon (mirrors the active side) */}
        {isDark ? (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="var(--color-primary)"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--warning, #ff9500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </span>
    </button>
  )
}
