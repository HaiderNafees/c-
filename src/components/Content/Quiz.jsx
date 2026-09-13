import { useState, useEffect } from 'react'
import QuizQuestion from './QuizQuestion'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getQuiz } from '../../data/quizzes'

/* ============================================================
   Quiz
   5-question quiz engine for a topic.
   - Mix of Multiple Choice / Predict Output / Find the Error
   - Instant feedback per question
   - Final score as percentage
   - Auto-saves score to progress JSON (quizScores[topicId])
   - Retake option

   Props: topicId (string)
   ============================================================ */

export default function Quiz({ topicId }) {
  const { progress, updateProgress } = useAuth()
  const { showToast } = useToast()
  const questions = getQuiz(topicId)

  const [answers, setAnswers] = useState({}) // { questionIndex: selectedOption }
  const [submitted, setSubmitted] = useState(false)

  // Reset state when switching topics.
  useEffect(() => {
    setAnswers({})
    setSubmitted(false)
  }, [topicId])

  const savedScore = progress?.quizScores?.[topicId]

  const handleAnswer = (qIdx, optionIdx) => {
    if (answers[qIdx] !== undefined) return // lock once answered
    setAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }))
  }

  const allAnswered = Object.keys(answers).length === questions.length

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++
    })
    const score = Math.round((correct / questions.length) * 100)

    updateProgress((prev) => ({
      quizScores: { ...prev.quizScores, [topicId]: score },
      totalPoints: prev.totalPoints + Math.round(score / 10),
    }))
    setSubmitted(true)
    showToast(
      score >= 80
        ? `Quiz complete — ${score}%`
        : score >= 60
          ? `Quiz complete — ${score}%`
          : `Quiz complete — ${score}%`,
      score >= 60 ? 'success' : 'info',
    )
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
  }

  if (questions.length === 0) {
    return (
      <div
        className="p-5 rounded-xl text-sm text-center"
        style={{
          background: 'var(--surface-secondary)',
          color: 'var(--text-muted)',
          border: '1px solid var(--surface-border)',
        }}
      >
        No quiz available for this topic yet.
      </div>
    )
  }

  const score =
    submitted || savedScore !== undefined
      ? (() => {
          if (submitted) {
            let c = 0
            questions.forEach((q, idx) => {
              if (answers[idx] === q.correctIndex) c++
            })
            return Math.round((c / questions.length) * 100)
          }
          return savedScore
        })()
      : null

  return (
    <div className="space-y-4">
      {/* Score banner */}
      {submitted && score !== null && (
        <div
          className="p-5 rounded-xl text-center"
          style={{
            background:
              score >= 80
                ? 'color-mix(in srgb, var(--color-success) 15%, transparent)'
                : score >= 60
                  ? 'color-mix(in srgb, var(--color-warning) 15%, transparent)'
                  : 'color-mix(in srgb, #ff453a 15%, transparent)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <div
            className="text-4xl font-bold"
            style={{
              color:
                score >= 80
                  ? 'var(--color-success)'
                  : score >= 60
                    ? 'var(--color-warning)'
                    : '#ff453a',
              transition: 'all 300ms ease-in-out',
            }}
          >
            {score}%
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {score >= 80
              ? 'Excellent work'
              : score >= 60
                ? 'Good effort'
                : 'Keep practicing'}
          </div>
        </div>
      )}

      {/* Previous score notice (if not submitted this session) */}
      {!submitted && savedScore !== undefined && (
        <div
          className="p-3 rounded-lg text-xs text-center"
          style={{
            background: 'var(--surface-secondary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--surface-border)',
          }}
        >
          Previous best: <strong>{savedScore}%</strong>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, idx) => (
        <QuizQuestion
          key={idx}
          question={q}
          questionNumber={idx + 1}
          selectedIndex={answers[idx]}
          onAnswer={(opt) => handleAnswer(idx, opt)}
        />
      ))}

      {/* Submit / Retake */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="btn-primary"
            style={{
              opacity: allAnswered ? 1 : 0.5,
              cursor: allAnswered ? 'pointer' : 'not-allowed',
            }}
          >
            Submit Quiz
          </button>
        ) : (
          <button type="button" onClick={handleRetake} className="btn-primary">
            ↻ Retake Quiz
          </button>
        )}
      </div>
    </div>
  )
}
