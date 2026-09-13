import Exercise from './Exercise'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getExercises } from '../../data/exercises'

/* ============================================================
   ExerciseList
   Renders all exercises for a given topic.
   Marks exercises as completed → saves to progress JSON
   (exercisesCompleted: { topicId: [index, ...] }).

   Props: topicId (string)
   ============================================================ */

export default function ExerciseList({ topicId }) {
  const { progress, updateProgress } = useAuth()
  const { showToast } = useToast()
  const exercises = getExercises(topicId)

  const completed = new Set(progress?.exercisesCompleted?.[topicId] ?? [])

  const handleComplete = (index) => {
    if (completed.has(index)) return
    updateProgress((prev) => {
      const prevList = prev.exercisesCompleted[topicId] || []
      return {
        exercisesCompleted: {
          ...prev.exercisesCompleted,
          [topicId]: [...prevList, index],
        },
        totalPoints: prev.totalPoints + 5,
      }
    })
    showToast('Exercise completed (+5 pts)', 'success')
  }

  if (exercises.length === 0) {
    return (
      <div
        className="p-5 rounded-xl text-sm text-center"
        style={{
          background: 'var(--surface-secondary)',
          color: 'var(--text-muted)',
          border: '1px solid var(--surface-border)',
        }}
      >
        No exercises available for this topic yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {exercises.map((ex, idx) => (
        <Exercise
          key={idx}
          exercise={ex}
          index={idx}
          isCompleted={completed.has(idx)}
          onComplete={() => handleComplete(idx)}
        />
      ))}
    </div>
  )
}
