import { formatElapsedTime } from '../../hooks/useChallengeTimer.js'
import { getMemoryExerciseName } from '../../utils/memoryGenerator.js'

export default function MemoryResults({ session, onAgain, onDashboard, onHome }) {
  const message = session.accuracy >= 90
    ? 'A focused session. Nicely done.'
    : session.accuracy >= 70
      ? 'Good attention to detail.'
      : 'A useful round of practice.'

  return (
    <section className="memory-results">
      <div className={`result-medallion ${session.accuracy >= 85 ? 'result-great' : ''}`} aria-hidden="true">
        {session.accuracy >= 85 ? '✦' : '✓'}
      </div>
      <div className="eyebrow result-eyebrow"><span className="eyebrow-dot" /> SESSION COMPLETE</div>
      <h1 className="page-title result-title">{message}</h1>
      <p className="page-description">{getMemoryExerciseName(session.exerciseType)} · {session.difficulty}</p>

      <div className="memory-results-grid">
        <ResultMetric label="Questions" value={session.totalQuestions} />
        <ResultMetric label="Correct" value={session.correctAnswers} />
        <ResultMetric label="Incorrect" value={session.incorrectAnswers} />
        <ResultMetric label="Recall accuracy" value={`${session.accuracy}%`} />
        <ResultMetric label="Word-order accuracy" value={`${session.wordOrderAccuracy}%`} />
        <ResultMetric label="Session score" value={`${session.performanceScore}%`} />
      </div>
      <div className="memory-time-summary">
        <div><span>Average response time</span><strong>{(session.averageResponseTimeMs / 1000).toFixed(1)} sec</strong></div>
        <div><span>Total practice time</span><strong>{formatElapsedTime(session.totalDurationMs)}</strong></div>
      </div>
      <p className="memory-results-caveat">One practice session is a snapshot, not evidence of improvement in memory.</p>
      <div className="memory-result-actions">
        <button className="primary-button" type="button" onClick={onAgain}>Try another <span aria-hidden="true">↻</span></button>
        <button className="secondary-button" type="button" onClick={onDashboard}>View memory progress</button>
        <button className="text-button" type="button" onClick={onHome}>Memory home</button>
      </div>
    </section>
  )
}

function ResultMetric({ label, value }) {
  return <div className="memory-result-metric"><strong>{value}</strong><span>{label}</span></div>
}
