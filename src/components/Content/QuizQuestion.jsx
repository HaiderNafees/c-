/* ============================================================
   QuizQuestion
   A single quiz question with multiple-choice options.
   - Shows the question + 4 option buttons
   - After selection: green = correct, red = selected wrong
   - Displays the explanation

   Props:
     question: { question, options, correctIndex, explanation }
     selectedIndex: number | null
     onAnswer: (index) => void
   ============================================================ */

export default function QuizQuestion({
  question,
  selectedIndex,
  onAnswer,
  questionNumber,
}) {
  const isAnswered = selectedIndex !== null && selectedIndex !== undefined

  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: 'var(--surface-secondary)',
        border: '1px solid var(--surface-border)',
      }}
    >
      <div className="flex items-start gap-2 mb-3">
        <span
          className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
          }}
          aria-hidden="true"
        >
          {questionNumber}
        </span>
        <p
          className="font-medium text-sm"
          style={{ color: 'var(--text-heading)' }}
        >
          {question.question}
        </p>
      </div>

      <div className="grid gap-2">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.correctIndex
          const isSelected = idx === selectedIndex

          let bg = 'var(--surface)'
          let border = 'var(--surface-border)'
          let color = 'var(--text-body)'

          if (isAnswered) {
            if (isCorrect) {
              bg = 'color-mix(in srgb, var(--color-success) 18%, transparent)'
              border = 'var(--color-success)'
              color = 'var(--text-heading)'
            } else if (isSelected) {
              bg = 'color-mix(in srgb, #ff453a 18%, transparent)'
              border = '#ff453a'
              color = 'var(--text-heading)'
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => onAnswer(idx)}
              className="text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                cursor: isAnswered ? 'default' : 'pointer',
                opacity:
                  isAnswered && !isCorrect && !isSelected ? 0.6 : 1,
              }}
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
              {isAnswered && isCorrect && (
                <span
                  className="float-right text-xs font-bold"
                  style={{ color: 'var(--color-success)' }}
                  aria-hidden="true"
                >
                  CORRECT
                </span>
              )}
              {isAnswered && isSelected && !isCorrect && (
                <span
                  className="float-right text-xs font-bold"
                  style={{ color: 'var(--color-danger)' }}
                  aria-hidden="true"
                >
                  INCORRECT
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div
          className="mt-3 p-3 rounded-lg text-xs"
          style={{
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <strong style={{ color: 'var(--text-body)' }}>Explanation: </strong>
          {question.explanation}
        </div>
      )}
    </div>
  )
}
