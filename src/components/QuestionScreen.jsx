import { useLayoutEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import { formatElapsedTime } from '../hooks/useChallengeTimer.js'

export default function QuestionScreen({
  marks,
  difficulty,
  questions,
  questionIndex,
  correct,
  incorrect,
  onAnswer,
  onNext,
  onExit,
  elapsedMs,
}) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const inputRef = useRef(null)
  const feedbackRef = useRef(null)
  const transitioningRef = useRef(false)
  const question = questions[questionIndex]
  const answered = correct + incorrect
  const progress = Math.round((answered / questions.length) * 100)

  useLayoutEffect(() => {
    transitioningRef.current = false
    inputRef.current?.focus()
  }, [questionIndex])

  function submitAnswer() {
    if (feedbackRef.current || transitioningRef.current || answer.trim() === '') return

    const isCorrect = Number(answer) === question.answer
    const result = { isCorrect, correctAnswer: question.answer }
    feedbackRef.current = result
    setFeedback(result)
    onAnswer(isCorrect)
    inputRef.current?.focus()
  }

  function advanceQuestion() {
    if (!feedbackRef.current || transitioningRef.current) return
    transitioningRef.current = true
    setAnswer('')
    setFeedback(null)
    feedbackRef.current = null
    inputRef.current?.focus()
    onNext()
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitAnswer()
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return
    if (!event.target.closest('.answer-form')) return

    event.preventDefault()
    if (feedbackRef.current) advanceQuestion()
    else submitAnswer()
  }

  return (
    <section className="practice-wrap" onKeyDown={handleKeyDown}>
      <div className="session-meta">
        <span className="session-chip">{difficulty}</span>
        <span className="session-length">{marks} question session</span>
        <span className="challenge-timer" role="timer" aria-label={`Elapsed time ${formatElapsedTime(elapsedMs)}`}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="11" r="6.5" />
            <path d="M10 7.5v3.8l2.4 1.4M8 2.5h4M10 2.5v2" />
          </svg>
          <span>{formatElapsedTime(elapsedMs)}</span>
        </span>
        <button className="exit-button" onClick={onExit} aria-label="Leave practice session">✕</button>
      </div>

      <div className="progress-info">
        <span>Question <strong>{questionIndex + 1}</strong> <span className="muted">/ {questions.length}</span></span>
        <span className="progress-score"><span className="score-check">✓</span> {correct} <span className="muted">/ {answered} correct</span></span>
      </div>
      <ProgressBar value={progress} />

      <div className="question-card">
        <div className="question-overline">SOLVE THE FOLLOWING</div>
        <div className="math-expression" aria-live="polite">{question.prompt}</div>
        <form className="answer-form" onSubmit={handleSubmit}>
          <label className="input-label" htmlFor="answer">Your answer</label>
          <div className={`answer-field ${feedback ? (feedback.isCorrect ? 'answer-correct' : 'answer-incorrect') : ''}`}>
            <input
              ref={inputRef}
              id="answer"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={answer}
              onChange={(event) => {
                if (!feedbackRef.current) setAnswer(event.target.value)
              }}
              placeholder="Type a number"
              required
              aria-describedby={feedback ? 'answer-feedback' : undefined}
            />
            {feedback && (
              <span className="answer-status" aria-hidden="true">
                {feedback.isCorrect ? '✓' : '×'}
              </span>
            )}
          </div>

          {feedback ? (
            <div
              id="answer-feedback"
              className={`feedback-message ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
              role="status"
            >
              <span>{feedback.isCorrect ? 'Nicely done!' : `Not quite — the answer is ${feedback.correctAnswer}.`}</span>
              <button
                className="primary-button next-button"
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault()
                  inputRef.current?.focus()
                }}
                onClick={advanceQuestion}
              >
                {questionIndex + 1 === questions.length ? 'See my results' : 'Next question'} <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <button
              className="primary-button submit-button"
              type="submit"
              disabled={!answer.trim()}
              onPointerDown={(event) => {
                event.preventDefault()
                inputRef.current?.focus()
              }}
            >
              Check answer <span aria-hidden="true">→</span>
            </button>
          )}
        </form>
      </div>

      <div className="session-stats" aria-label="Session score">
        <div className="stat-item"><span className="stat-value">{correct}</span><span className="stat-name">Correct</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-value">{incorrect}</span><span className="stat-name">To revisit</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-value">{questions.length - answered}</span><span className="stat-name">Remaining</span></div>
      </div>
      <p className="keyboard-hint">TIP <span>Press</span> <kbd>Enter ↵</kbd> <span>{feedback ? 'to continue' : 'to check your answer'}</span></p>
    </section>
  )
}
