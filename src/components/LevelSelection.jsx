const levels = [
  { name: 'Easy', note: 'Warm up with the basics', detail: 'Single digits · Simple operations', icon: '○', color: 'easy' },
  { name: 'Medium', note: 'Find your rhythm', detail: 'Two digits · Mixed arithmetic', icon: '◒', color: 'medium' },
  { name: 'Hard', note: 'Ready for a challenge?', detail: 'Big numbers · Multi-step maths', icon: '◉', color: 'hard' },
]

export default function LevelSelection({ marks, onSelect, onBack }) {
  return (
    <>
      <button className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Change session length</button>
      <div className="eyebrow"><span className="eyebrow-dot" /> {marks} QUESTIONS</div>
      <h1 className="page-title">Pick your pace.</h1>
      <p className="page-description">Choose a level that feels right for you today.</p>
      <div className="levels-grid">
        {levels.map((level) => (
          <button
            className={`selection-card level-card ${level.color}`}
            key={level.name}
            onClick={() => onSelect(level.name)}
          >
            <span className="level-icon" aria-hidden="true">{level.icon}</span>
            <span className="level-name">{level.name}</span>
            <span className="level-note">{level.note}</span>
            <span className="level-detail">{level.detail}</span>
            <span className="level-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <p className="quiet-note"><span aria-hidden="true">✦</span> You can take your time. Your progress is just for you.</p>
    </>
  )
}
