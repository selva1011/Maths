import { useState } from 'react'
import { getLeaderboard, getOrdinal } from '../../utils/leaderboard.js'
import { formatElapsedTime } from '../../hooks/useChallengeTimer.js'

const levels = ['Easy', 'Medium', 'Hard']

export default function Leaderboard({ results }) {
  const [activeLevel, setActiveLevel] = useState('Easy')
  const entries = getLeaderboard(results, activeLevel)

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> TOP PRACTICE SESSIONS</div>
          <h2 className="dashboard-section-title">Leaderboards</h2>
        </div>
        <span className="local-badge">This browser</span>
      </div>
      <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard difficulty">
        {levels.map((level) => (
          <button
            key={level}
            id={`leaderboard-tab-${level.toLowerCase()}`}
            className={`leaderboard-tab ${activeLevel === level ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeLevel === level}
            aria-controls="leaderboard-panel"
            onClick={() => setActiveLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
      <div id="leaderboard-panel" role="tabpanel" aria-labelledby={`leaderboard-tab-${activeLevel.toLowerCase()}`}>
        {entries.length ? (
          <div className="leaderboard-table-wrap">
            <table className="leaderboard-table">
              <thead>
                <tr><th>Rank</th><th>Participant</th><th>Marks</th><th>Accuracy</th><th>Time</th></tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.participantId}>
                    <td><span className={`rank-badge rank-${entry.rank}`}>{getOrdinal(entry.rank)}</span></td>
                    <td className="leaderboard-name">{entry.participantName}</td>
                    <td>{entry.marksObtained} / {entry.totalQuestions}</td>
                    <td>{entry.accuracy}%</td>
                    <td className="leaderboard-time">{formatElapsedTime(entry.totalTimeMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-leaderboard">
            <span className="empty-mark" aria-hidden="true">✳</span>
            <p>No {activeLevel.toLowerCase()} results yet.</p>
            <span>Complete a challenge to appear here.</span>
          </div>
        )}
      </div>
      <p className="local-data-note">Rankings use each participant’s best result. Data is saved only in this browser; this isn’t a global leaderboard.</p>
    </section>
  )
}
