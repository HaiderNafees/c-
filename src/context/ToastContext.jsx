import { createContext, useContext, useState, useCallback } from 'react'

/* ============================================================
   ToastContext
   Lightweight toast notification system.
   Usage: const { showToast } = useToast()
          showToast('Saved!', 'success')
   Types: 'success' | 'error' | 'info'
   ============================================================ */

const ToastContext = createContext(undefined)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = ++toastId
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), duration)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (ctx === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

/* ---------- Toast container + individual toasts ---------- */

const TOAST_STYLES = {
  success: {
    bg: 'color-mix(in srgb, var(--color-success) 18%, transparent)',
    border: 'var(--color-success)',
    icon: '',
  },
  error: {
    bg: 'color-mix(in srgb, var(--color-danger) 18%, transparent)',
    border: 'var(--color-danger)',
    icon: '',
  },
  info: {
    bg: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
    border: 'var(--color-primary)',
    icon: '',
  },
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div
      className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full"
      style={{ pointerEvents: 'none' }}
    >
      {toasts.map((t) => {
        const s = TOAST_STYLES[t.type] || TOAST_STYLES.info
        return (
          <div
            key={t.id}
            className="toast-enter pointer-events-auto px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              color: 'var(--text-heading)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
            onClick={() => onClose(t.id)}
            role="status"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: s.border }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium flex-1">{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
