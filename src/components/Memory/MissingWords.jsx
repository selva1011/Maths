import { useState } from 'react'

export default function MissingWords({ question, onSubmit }) {
  const [answers, setAnswers] = useState(() => question.missingIndexes.map(() => ''))

  function submit(event) {
    event.preventDefault()
    const reconstructed = [...question.tokens]
    question.missingIndexes.forEach((tokenIndex, answerIndex) => {
      reconstructed[tokenIndex] = answers[answerIndex].trim()
    })
    onSubmit(reconstructed)
  }

  return (
    <form className="memory-recall-form" onSubmit={submit}>
      <p className="memory-instruction">Fill in the words that were hidden from the sentence.</p>
      <div className="missing-sentence">
        {question.tokens.map((token, index) => {
          const blankIndex = question.missingIndexes.indexOf(index)
          return blankIndex === -1
            ? <span key={index}>{token}</span>
            : (
              <input
                key={index}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label={`Missing word ${blankIndex + 1}`}
                value={answers[blankIndex]}
                onChange={(event) => {
                  const next = [...answers]
                  next[blankIndex] = event.target.value
                  setAnswers(next)
                }}
                required
              />
            )
        })}
      </div>
      <button className="primary-button memory-submit" type="submit" disabled={answers.some((answer) => !answer.trim())}>
        Check my answer <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
