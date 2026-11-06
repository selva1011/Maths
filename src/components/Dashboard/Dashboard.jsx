import Leaderboard from './Leaderboard.jsx'
import ParticipantStats from './ParticipantStats.jsx'
import { getDashboardSummary, getParticipantStats } from '../../utils/leaderboard.js'

export default function Dashboard({ participant, results, onReturn }) {
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
