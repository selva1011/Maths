import { useState } from 'react'
import { getNextDifficultyRecommendation } from '../../utils/memoryScoring.js'

const exerciseOptions = [
  { value: 'sentence', label: 'Sentence Memory', detail: 'Read a sentence, then rebuild it from memory.', icon: 'Aa' },
  { value: 'wordOrder', label: 'Word Order Memory', detail: 'Remember where each word belongs.', icon: '↔' },
  { value: 'missingWords', label: 'Missing Words', detail: 'Recall the words hidden from a sentence.', icon: '…' },
  { value: 'sequence', label: 'Sequence Memory', detail: 'Remember numbers, words, and objects in order.', icon: '123' },
]
const difficulties = ['Easy', 'Medium', 'Hard', 'Expert']
const questionCounts = [5, 10, 15, 20]
const displayDurations = [5, 10, 15, 20]

export default function MemorySetup({ sessions, onStart, onBack }) {
  const [exerciseType, setExerciseType] = useState('sentence')
  const [difficulty, setDifficulty] = useState('Easy')
  const [questionCount, setQuestionCount] = useState(5)
  const [displaySeconds, setDisplaySeconds] = useState(10)
  const recommendation = getNextDifficultyRecommendation(sessions, exerciseType, difficulty)

  function submit(event) {
    event.preventDefault()
    onStart({ exerciseType, difficulty, questionCount, displaySeconds })
  }

  return (
    <section className="memory-setup">
      <button className="back-button memory-back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Memory Training
      </button>
      <div className="eyebrow"><span className="eyebrow-dot" /> BUILD YOUR SESSION</div>
      <h1 className="page-title">What would you<br className="desktop-break" /> like to practise?</h1>
      <p className="page-description">Set a comfortable pace. You can change these anytime.</p>

      <form className="memory-setup-form" onSubmit={submit}>
        <fieldset className="memory-fieldset">
          <legend>Exercise type</legend>
          <div className="memory-type-grid">
            {exerciseOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`memory-type-option ${exerciseType === option.value ? 'selected' : ''}`}
                aria-pressed={exerciseType === option.value}
                onClick={() => setExerciseType(option.value)}
              >
                <span className="memory-exercise-icon" aria-hidden="true">{option.icon}</span>
                <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                <span className="memory-selected-mark" aria-hidden="true">{exerciseType === option.value ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <OptionGroup label="Difficulty" value={difficulty} options={difficulties} onChange={setDifficulty} />
        <OptionGroup label="Number of questions" value={questionCount} options={questionCounts} onChange={(value) => setQuestionCount(Number(value))} />
        <OptionGroup label="Sentence / sequence display" value={displaySeconds} options={displayDurations} suffix=" sec" onChange={(value) => setDisplaySeconds(Number(value))} />

        <p className="memory-recommendation">
          <span>Suggested next level: <strong>{recommendation.level}</strong></span>
          <span>{recommendation.reason}</span>
        </p>
        <button className="primary-button memory-start-button" type="submit">
          Start memory session <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  )
}

function OptionGroup({ label, value, options, suffix = '', onChange }) {
  const groupName = label.toLowerCase().replaceAll(' ', '-')
  return (
    <fieldset className="memory-fieldset option-fieldset">
      <legend>{label}</legend>
      <div className="memory-option-row">
        {options.map((option) => (
          <button
            type="button"
            className={`memory-option ${value === option ? 'selected' : ''}`}
            key={option}
            aria-pressed={value === option}
            aria-label={`${label}: ${option}${suffix}`}
            name={groupName}
            onClick={() => onChange(option)}
          >
            {option}{suffix}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
