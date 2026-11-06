import { formatElapsedTime } from '../../hooks/useChallengeTimer.js'

const levels = ['Easy', 'Medium', 'Hard']

export default function ParticipantStats({ participant, stats }) {
  return (
    <section className="dashboard-panel participant-panel">
      <div className="dashboard-panel-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PROGRESS</div>
          <h2 className="dashboard-section-title">{participant.name}’s performance</h2>
        </div>
        <span className="participant-device">{participant.deviceType} · {participant.browser}</span>
      </div>
      <div className="personal-summary">
        <div><strong>{stats.totalChallenges}</strong><span>Challenges</span></div>
        <div><strong>{stats.averageAccuracy}%</strong><span>Average accuracy</span></div>
        {levels.map((level) => (
          <div key={level}>
            <strong>{stats.bestScores[level]?.marksObtained ?? '—'}</strong>
            <span>Best {level}</span>
          </div>
        ))}
      </div>
      <div className="history-heading">
        <h3>Recent challenges</h3>
        {stats.recentResults.length > 0 && <span>Last {stats.recentResults.length}</span>}
      </div>
      {stats.recentResults.length ? (
        <div className="history-list">
          {stats.recentResults.map((result) => (
            <div className="history-row" key={result.id}>
              <span className={`history-level level-${result.difficulty.toLowerCase()}`}>{result.difficulty}</span>
              <span className="history-score">{result.marksObtained}/{result.totalQuestions} marks</span>
              <span className="history-time">{formatElapsedTime(result.totalTimeMs)}</span>
              <time dateTime={result.completedAt}>{new Date(result.completedAt).toLocaleDateString()}</time>
            </div>
          ))}
        </div>
      ) : (
        <p className="history-empty">Your completed challenges will show up here.</p>
      )}
    </section>
  )
}
