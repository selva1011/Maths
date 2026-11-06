import Leaderboard from './Leaderboard.jsx'
import ParticipantStats from './ParticipantStats.jsx'
import { getDashboardSummary, getParticipantStats } from '../../utils/leaderboard.js'

export default function Dashboard({ participant, results, onReturn, onOpenMemory }) {
  const summary = getDashboardSummary(results, participant)
  const personalStats = getParticipantStats(results, participant.id)

  return (
    <section className="dashboard-content">
      <div className="dashboard-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NUMBERLY</div>
          <h1 className="page-title">A little progress adds up.</h1>
          <p className="page-description">Your practice at a glance, {participant.name}.</p>
        </div>
        <button className="secondary-button return-challenge" onClick={onReturn}>
          <span aria-hidden="true">←</span> Return to challenge
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total participants" value={summary.totalParticipants} icon="♙" />
        <SummaryCard label="Challenges completed" value={summary.totalChallenges} icon="▤" />
        <SummaryCard label="Correct answers" value={summary.correctAnswers} icon="✓" />
        <SummaryCard label="Average accuracy" value={`${summary.averageAccuracy}%`} icon="◔" />
      </div>

      <button className="dashboard-memory-entry" type="button" onClick={onOpenMemory}>
        <span className="dashboard-memory-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M9.8 3.2a3 3 0 0 0-5.6 1.3A3.2 3.2 0 0 0 3 10a3.2 3.2 0 0 0 2.1 5.5 3 3 0 0 0 4.7 1.3m.4-13.6a3 3 0 0 1 5.6 1.3A3.2 3.2 0 0 1 17 10a3.2 3.2 0 0 1-2.1 5.5 3 3 0 0 1-4.7 1.3M10 3v14M5.2 8.2h2m5.4 3.6h2.2" />
          </svg>
        </span>
        <span><strong>Try Memory Training</strong><small>Sentence, word-order, missing-word, and sequence exercises</small></span>
        <span className="dashboard-memory-arrow" aria-hidden="true">→</span>
      </button>

      <div className="dashboard-grid">
        <Leaderboard results={results} />
        <ParticipantStats participant={participant} stats={personalStats} />
      </div>
      <p className="dashboard-footnote">Participant ID: {participant.id} · Local browser data. Clearing browser storage removes this history.</p>
    </section>
  )
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="summary-card">
      <span className="summary-icon" aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
