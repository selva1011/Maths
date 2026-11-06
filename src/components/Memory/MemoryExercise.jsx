import { useEffect, useRef, useState } from 'react'
import { formatElapsedTime } from '../../hooks/useChallengeTimer.js'
import { generateMemoryQuestions, getMemoryExerciseName } from '../../utils/memoryGenerator.js'
import { scoreMemoryAnswer, scoreMissingWords, summarizeMemorySession } from '../../utils/memoryScoring.js'
import MissingWords from './MissingWords.jsx'
import SentenceMemory from './SentenceMemory.jsx'
import SequenceMemory from './SequenceMemory.jsx'
import WordOrderMemory from './WordOrderMemory.jsx'

export default function MemoryExercise({ config, onComplete, onExit }) {
  const [questions] = useState(() => generateMemoryQuestions(config.exerciseType, config.difficulty, config.questionCount))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState('reading')
  const [timeLeftMs, setTimeLeftMs] = useState(config.displaySeconds * 1000)
  const [questionResults, setQuestionResults] = useState([])
  const [feedback, setFeedback] = useState(null)
  const recallStartedAtRef = useRef(null)
  const submittedRef = useRef(false)
  const advancedRef = useRef(false)
  const question = questions[questionIndex]
  const progress = Math.round(((questionIndex + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100)

  useEffect(() => {
    advancedRef.current = false
  }, [questionIndex])

  useEffect(() => {
    if (phase !== 'reading') return undefined

    const deadline = Date.now() + config.displaySeconds * 1000
    const intervalId = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now())
      setTimeLeftMs(remaining)
      if (remaining === 0) {
        window.clearInterval(intervalId)
        recallStartedAtRef.current = Date.now()
        setPhase('recall')
      }
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [config.displaySeconds, phase, questionIndex])

  function submitAnswer(answerTokens) {
    if (phase !== 'recall' || submittedRef.current) return
    submittedRef.current = true
    const scoring = question.type === 'missingWords'
      ? scoreMissingWords(question.tokens, answerTokens, question.missingIndexes)
      : scoreMemoryAnswer(question.tokens, answerTokens)
    const result = {
      ...scoring,
      isExact: scoring.isExact,
      responseTimeMs: recallStartedAtRef.current === null ? 0 : Date.now() - recallStartedAtRef.current,
      originalTokens: question.tokens,
      submittedTokens: answerTokens,
    }
    const nextResults = [...questionResults, result]
    setQuestionResults(nextResults)
    setFeedback(result)
    setPhase('feedback')
  }

  function nextQuestion() {
    if (phase !== 'feedback' || advancedRef.current) return
    advancedRef.current = true
    if (questionIndex + 1 === questions.length) {
      onComplete({
        ...summarizeMemorySession(questionResults),
      })
      return
    }

    submittedRef.current = false
    recallStartedAtRef.current = null
    setFeedback(null)
    setTimeLeftMs(config.displaySeconds * 1000)
    setQuestionIndex((index) => index + 1)
    setPhase('reading')
  }

  const exerciseName = getMemoryExerciseName(config.exerciseType)
  const readingDisplay = question.type === 'sequence'
    ? question.display.join('  →  ')
    : question.sentence

  return (
    <section className={`memory-exercise memory-phase-${phase}`}>
      <div className="memory-session-header">
        <div>
          <span className="memory-session-tag">{exerciseName}</span>
          <span className="session-chip">{config.difficulty}</span>
        </div>
        <div className="memory-session-header-actions">
          <span className="memory-question-count">Question {questionIndex + 1} / {questions.length}</span>
          <button type="button" className="exit-button" aria-label="Exit memory session" onClick={onExit}>✕</button>
        </div>
      </div>
      <div className="memory-progress-track" aria-label={`Question progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      {phase === 'reading' && (
        <div className="memory-display-stage">
          <div className="memory-countdown" role="timer" aria-label={`${Math.ceil(timeLeftMs / 1000)} seconds remaining`}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="11" r="6.5" />
              <path d="M10 7.5v3.8l2.4 1.4M8 2.5h4M10 2.5v2" />
            </svg>
            <span>{formatElapsedTime(timeLeftMs)}</span>
          </div>
          <p className="memory-stage-label">READ AND REMEMBER</p>
          <h1 className="memory-prompt">{question.prompt}</h1>
          {question.type === 'missingWords' && (
            <div className="memory-reading-sentence">{question.sentence}</div>
          )}
          {question.type === 'sequence' && (
            <div className="memory-reading-sequence">{readingDisplay}</div>
          )}
          {(question.type === 'sentence' || question.type === 'wordOrder') && (
            <div className="memory-reading-sentence">{question.sentence}</div>
          )}
          <p className="memory-read-reminder">The {question.type === 'sequence' ? 'sequence' : 'prompt'} will disappear when the timer ends.</p>
        </div>
      )}

      {phase === 'recall' && (
        <div className="memory-recall-stage">
          <div className="memory-stage-label">MEMORY RECALL</div>
          <h1 className="memory-prompt">{question.prompt}</h1>
          {question.type === 'sentence' && <SentenceMemory question={question} onSubmit={submitAnswer} />}
          {question.type === 'wordOrder' && <WordOrderMemory question={question} onSubmit={submitAnswer} />}
          {question.type === 'missingWords' && <MissingWords question={question} onSubmit={submitAnswer} />}
          {question.type === 'sequence' && <SequenceMemory question={question} onSubmit={submitAnswer} />}
        </div>
      )}

      {phase === 'feedback' && feedback && (
        <div className="memory-feedback-stage">
          <div className={`memory-result-mark ${feedback.isExact ? 'correct' : ''}`} aria-hidden="true">
            {feedback.isExact ? '✓' : '↗'}
          </div>
          <h1 className="memory-prompt">{feedback.isExact ? 'Exactly remembered.' : 'Here’s what you remembered.'}</h1>
          <p className="memory-correct-answer">
            {question.type === 'sequence' ? question.tokens.join(' → ') : question.sentence}
          </p>
          <div className="memory-question-stats">
            <span><strong>{feedback.wordsRemembered}/{feedback.totalWords}</strong> words remembered</span>
            <span><strong>{feedback.wordOrderAccuracy}%</strong> in the right position</span>
            <span><strong>{feedback.recallAccuracy}%</strong> recall</span>
          </div>
          <button className="primary-button memory-continue" type="button" onClick={nextQuestion}>
            {questionIndex + 1 === questions.length ? 'See session results' : 'Next question'} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      <p className="memory-session-note">A practice exercise, not a measure or diagnosis of memory ability.</p>
    </section>
  )
}
