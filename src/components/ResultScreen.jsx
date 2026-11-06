import { formatElapsedTime } from '../hooks/useChallengeTimer.js'

export default function ResultScreen({ marks, difficulty, total, correct, incorrect, totalTimeMs, onTryAgain, onChangeDifficulty }) {
  const accuracy = Math.round((correct / total) * 100)
  const averageTimeSeconds = Math.round(totalTimeMs / 1000 / total)
  const message = accuracy === 100
    ? 'A perfect round. You nailed it!'
    : accuracy >= 80
      ? 'Brilliant work. You really know your stuff!'
      : accuracy >= 50
        ? 'Good effort. You’re building momentum!'
        : 'Every try makes you stronger. Keep going!'

  return (
    <section className="result-wrap">
      <div className={`result-medallion ${accuracy >= 80 ? 'result-great' : ''}`} aria-hidden="true">
        {accuracy >= 80 ? '✦' : '✓'}
      </div>
      <div className="eyebrow result-eyebrow"><span className="eyebrow-dot" /> SESSION COMPLETE</div>
      <h1 className="page-title result-title">{message}</h1>
      <p className="page-description">{difficulty} practice · {total} questions</p>

      <div className="result-score-card">
        <div className="result-primary-score">
          <span className="result-score-number">{correct}<span>/{total}</span></span>
          <span className="result-score-label">marks obtained</span>
        </div>
        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-number">{accuracy}%</span>
            <span className="result-stat-label">Accuracy</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-number">{correct}</span>
            <span className="result-stat-label">Correct</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-number">{incorrect}</span>
            <span className="result-stat-label">Incorrect</span>
          </div>
        </div>
      </div>
      <div className="result-time">
        <div><span>Total time</span><strong>{formatElapsedTime(totalTimeMs)}</strong></div>
        <div><span>Average per question</span><strong>{averageTimeSeconds} sec</strong></div>
      </div>
      <div className="result-actions">
        <button className="primary-button" onClick={onTryAgain}>Try again <span aria-hidden="true">↻</span></button>
        <button className="secondary-button" onClick={onChangeDifficulty}>Change difficulty</button>
      </div>
      <p className="quiet-note result-note"><span aria-hidden="true">✦</span> You practiced {marks} marks worth of maths. Nice one.</p>
    </section>
  )
}
