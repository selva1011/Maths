import { getNextDifficultyRecommendation } from '../../utils/memoryScoring.js'
import { getMemoryExerciseName } from '../../utils/memoryGenerator.js'
import { formatElapsedTime } from '../../hooks/useChallengeTimer.js'

const exerciseTypes = ['sentence', 'wordOrder', 'missingWords', 'sequence']

export default function MemoryDashboard({ sessions, onBack, onStart }) {
  const recent = [...sessions].sort((left, right) => right.completedAt.localeCompare(left.completedAt))
  const averageAccuracy = sessions.length
    ? Math.round(sessions.reduce((sum, session) => sum + session.accuracy, 0) / sessions.length)
    : 0
  const bestAccuracy = sessions.length ? Math.max(...sessions.map((session) => session.accuracy)) : 0
  const bestDifficulty = getBestDifficulty(sessions)
  const trend = recent.slice(0, 10).reverse()
  const recommendation = recent.length
    ? getNextDifficultyRecommendation(sessions, recent[0].exerciseType, recent[0].difficulty)
    : null

  return (
    <section className="memory-dashboard">
      <button className="back-button memory-back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Memory Training
      </button>
      <div className="eyebrow"><span className="eyebrow-dot" /> YOUR MEMORY PRACTICE</div>
      <h1 className="page-title">Progress, over time.</h1>
      <p className="page-description">A record of your practice sessions on this browser.</p>

      <div className="memory-dashboard-summary">
        <SummaryItem label="Sessions completed" value={sessions.length} />
        <SummaryItem label="Best accuracy" value={sessions.length ? `${bestAccuracy}%` : '—'} />
        <SummaryItem label="Average accuracy" value={sessions.length ? `${averageAccuracy}%` : '—'} />
        <SummaryItem label="Best difficulty" value={bestDifficulty} />
      </div>

      {recommendation && (
        <div className="memory-recommendation dashboard-recommendation">
          <span>Try <strong>{recommendation.level}</strong> next</span>
          <span>{recommendation.reason}</span>
        </div>
      )}

      <div className="memory-dashboard-panels">
        <section className="memory-dashboard-panel">
          <div className="memory-panel-heading">
            <div className="eyebrow"><span className="eyebrow-dot" /> SESSION TREND</div>
            <span>Most recent {trend.length}</span>
          </div>
          {trend.length ? (
            <div className="memory-trend-chart" role="img" aria-label="Accuracy by recent memory training session">
              {trend.map((session) => (
                <div className="memory-trend-column" key={session.id} title={`${session.accuracy}% — ${new Date(session.completedAt).toLocaleDateString()}`}>
                  <strong>{session.accuracy}%</strong>
                  <div className="memory-trend-bar"><span style={{ height: `${Math.max(4, session.accuracy)}%` }} /></div>
                  <small>{new Date(session.completedAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="memory-empty-note">Complete a session to begin your accuracy trend.</p>
          )}
        </section>

        <section className="memory-dashboard-panel">
          <div className="memory-panel-heading">
            <div className="eyebrow"><span className="eyebrow-dot" /> BY EXERCISE</div>
          </div>
          <div className="memory-type-performance">
            {exerciseTypes.map((type) => {
              const typeSessions = sessions.filter((session) => session.exerciseType === type)
              const average = typeSessions.length
                ? Math.round(typeSessions.reduce((sum, session) => sum + session.accuracy, 0) / typeSessions.length)
                : null
              return (
                <div key={type}>
                  <span>{getMemoryExerciseName(type)}</span>
                  <strong>{average === null ? '—' : `${average}%`}</strong>
                  <small>{typeSessions.length} {typeSessions.length === 1 ? 'session' : 'sessions'}</small>
                </div>
              )
            })}
          </div>
          <button className="primary-button memory-dashboard-start" type="button" onClick={onStart}>
            Start a session <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>

      <section className="memory-dashboard-panel memory-history-panel">
        <div className="memory-panel-heading">
          <div className="eyebrow"><span className="eyebrow-dot" /> RECENT HISTORY</div>
          <span>Latest 10 sessions</span>
        </div>
        {recent.length ? (
          <div className="memory-history-table-wrap">
            <table className="memory-history-table">
              <thead><tr><th>Date</th><th>Exercise</th><th>Difficulty</th><th>Questions</th><th>Accuracy</th><th>Response</th></tr></thead>
              <tbody>
                {recent.slice(0, 10).map((session) => (
                  <tr key={session.id}>
                    <td>{new Date(session.completedAt).toLocaleDateString()}</td>
                    <td>{getMemoryExerciseName(session.exerciseType)}</td>
                    <td>{session.difficulty}</td>
                    <td>{session.totalQuestions}</td>
                    <td>{session.accuracy}%</td>
                    <td>{(session.averageResponseTimeMs / 1000).toFixed(1)} sec</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="memory-empty-note">Your completed sessions will appear here.</p>
        )}
      </section>

      <p className="memory-dashboard-disclaimer">Your memory practice history is stored locally in this browser. Performance is for reflection and does not diagnose memory or prove improvement.</p>
    </section>
  )
}

function SummaryItem({ label, value }) {
  return <div><strong>{value}</strong><span>{label}</span></div>
}

function getBestDifficulty(sessions) {
  if (!sessions.length) return '—'
  const levels = ['Easy', 'Medium', 'Hard', 'Expert']
  const levelPerformance = levels.map((level) => {
    const levelSessions = sessions.filter((session) => session.difficulty === level)
    return {
      level,
      average: levelSessions.length
        ? levelSessions.reduce((sum, session) => sum + session.performanceScore, 0) / levelSessions.length
        : -1,
    }
  })
  return levelPerformance.sort((left, right) => right.average - left.average)[0].level
}
