import { useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

/* ============================================================
   useProgress
   Cloud storage + business-logic layer for per-user learning
   progress. All data is persisted to Supabase (user_progress
   table). localStorage is NO LONGER used for progress or auth.

   Table: user_progress
     user_id              (uuid)   -> auth.uid()
     started_on           (date)
     last_login           (date)
     lectures_completed   (TEXT[])
     exercises_completed  (JSONB)  -> { topicId: [indices], __completedDates: { topicId: date } }
     quiz_scores          (JSONB)  -> { topicId: score }
     total_points         (int)

   The `completedDates` field used by the UI is stored inside
   exercises_completed under the reserved key `__completedDates`
   so no schema change is required.
   ============================================================ */

/** Reserved key used to nest completedDates inside exercises_completed JSONB. */
const DATES_KEY = '__completedDates'

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
   Cloud storage helpers (Supabase)
   ============================================================ */

/**
 * Map a DB row (snake_case) to the frontend progress object
 * (camelCase). Separates completedDates from exercises_completed.
 */
function mapRowToProgress(row) {
  if (!row) return null

  const exercisesRaw = row.exercises_completed || {}
  const completedDates = exercisesRaw[DATES_KEY] || {}
  // Strip the reserved key so exercisesCompleted only holds topic arrays.
  const exercisesCompleted = { ...exercisesRaw }
  delete exercisesCompleted[DATES_KEY]

  return {
    username: row.user_id,
    startedOn: row.started_on,
    lastLogin: row.last_login,
    lecturesCompleted: row.lectures_completed || [],
    exercisesCompleted,
    quizScores: row.quiz_scores || {},
    totalPoints: row.total_points || 0,
    completedDates,
  }
}

/**
 * Map a frontend progress object to DB columns (snake_case).
 * Merges completedDates back into exercises_completed JSONB.
 */
function mapProgressToRow(progress) {
  const exercisesCompleted = { ...progress.exercisesCompleted }
  if (progress.completedDates && Object.keys(progress.completedDates).length) {
    exercisesCompleted[DATES_KEY] = progress.completedDates
  }
  return {
    user_id: progress.username,
    started_on: progress.startedOn,
    last_login: progress.lastLogin,
    lectures_completed: progress.lecturesCompleted || [],
    exercises_completed: exercisesCompleted,
    quiz_scores: progress.quizScores || {},
    total_points: progress.totalPoints || 0,
  }
}

/** Load a user's progress from Supabase (or null if none). */
export async function loadProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // No row yet (e.g. right after signup before trigger fires).
    return null
  }
  return mapRowToProgress(data)
}

/** Persist a progress object to Supabase (upsert by user_id). */
export async function saveProgress(userId, progress) {
  const row = mapProgressToRow(progress)
  const { error } = await supabase
    .from('user_progress')
    .upsert(row, { onConflict: 'user_id' })

  if (error) {
    console.error('Failed to save progress:', error)
    return false
  }
  return true
}

/* ============================================================
   React hook: exposes progress mutation helpers.
   Designed to be called from components that already have the
   current progress + a setter (provided by AuthContext).

   All mutators update React state synchronously (optimistic) and
   then persist to Supabase in the background.
   ============================================================ */
export function useProgress(progress, setProgress) {
  // Re-save the current progress to Supabase in the background.
  const persist = useCallback(
    (next) => {
      if (!next) return
      saveProgress(next.username, next) // fire-and-forget
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
