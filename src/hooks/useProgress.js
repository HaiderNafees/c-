import { useCallback } from 'react'

/* ============================================================
   useProgress
   Storage + business-logic layer for per-user learning
   progress. All data is persisted to localStorage — pure
   frontend, no backend required.

   localStorage keys:
     cpp-progress-<username>  Per-user progress JSON

   Progress data model:
     username             (string)
     startedOn            (YYYY-MM-DD)
     lastLogin            (YYYY-MM-DD)
     lecturesCompleted    (string[])
     exercisesCompleted   ({ topicId: [indices] })
     completedDates       ({ topicId: YYYY-MM-DD })
     quizScores           ({ topicId: score })
     totalPoints          (int)
   ============================================================ */

/** localStorage key prefix for per-user progress. */
export const PROGRESS_KEY_PREFIX = 'cpp-progress-'

/** Return today's date as YYYY-MM-DD (local time). */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Build a brand-new (empty) progress object for a user.
 * Matches the spec data model exactly.
 */
export function createEmptyProgress(username) {
  return {
    username,
    startedOn: todayISO(),
    lastLogin: todayISO(),
    lecturesCompleted: [],
    exercisesCompleted: {},
    quizScores: {},
    totalPoints: 0,
    completedDates: {},
  }
}

/* ============================================================
   Storage helpers (localStorage)
   ============================================================ */

/** Load a user's progress from localStorage (or null if none). */
export function loadProgress(username) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + username)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** Persist a progress object to localStorage. */
export function saveProgress(username, progress) {
  try {
    localStorage.setItem(PROGRESS_KEY_PREFIX + username, JSON.stringify(progress))
    return true
  } catch (error) {
    console.error('Failed to save progress:', error)
    return false
  }
}

/* ============================================================
   React hook: exposes progress mutation helpers.
   Designed to be called from components that already have the
   current progress + a setter (provided by AuthContext).

   All mutators update React state synchronously (optimistic) and
   then persist to localStorage instantly.
   ============================================================ */
export function useProgress(progress, setProgress) {
  // Re-save the current progress to localStorage in the background.
  const persist = useCallback(
    (next) => {
      if (!next) return
      saveProgress(next.username, next)
    },
    [],
  )

  /** Mark a lecture as complete (idempotent). */
  const markLectureComplete = useCallback(
    (topicId) => {
      setProgress((prev) => {
        if (!prev) return prev
        if (prev.lecturesCompleted.includes(topicId)) return prev
        const next = {
          ...prev,
          lecturesCompleted: [...prev.lecturesCompleted, topicId],
          completedDates: {
            ...prev.completedDates,
            [topicId]: todayISO(),
          },
          totalPoints: prev.totalPoints + 10,
        }
        persist(next)
        return next
      })
    },
    [setProgress, persist],
  )

  /** Mark a specific exercise of a topic as complete (idempotent). */
  const markExerciseComplete = useCallback(
    (topicId, exerciseId) => {
      setProgress((prev) => {
        if (!prev) return prev
        const list = prev.exercisesCompleted[topicId] || []
        if (list.includes(exerciseId)) return prev
        const next = {
          ...prev,
          exercisesCompleted: {
            ...prev.exercisesCompleted,
            [topicId]: [...list, exerciseId],
          },
          totalPoints: prev.totalPoints + 5,
        }
        persist(next)
        return next
      })
    },
    [setProgress, persist],
  )

  /** Save (overwrite) the quiz score for a topic. */
  const saveQuizScore = useCallback(
    (topicId, score) => {
      setProgress((prev) => {
        if (!prev) return prev
        const next = {
          ...prev,
          quizScores: { ...prev.quizScores, [topicId]: score },
        }
        persist(next)
        return next
      })
    },
    [setProgress, persist],
  )

  /** Add points to the running total. */
  const addPoints = useCallback(
    (points) => {
      setProgress((prev) => {
        if (!prev) return prev
        const next = { ...prev, totalPoints: prev.totalPoints + points }
        persist(next)
        return next
      })
    },
    [setProgress, persist],
  )

  return {
    markLectureComplete,
    markExerciseComplete,
    saveQuizScore,
    addPoints,
    persist,
  }
}
