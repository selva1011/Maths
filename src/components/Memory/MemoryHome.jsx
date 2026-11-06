const exercises = [
  { icon: 'Aa', title: 'Sentence Memory', detail: 'Read a sentence, then rebuild it from memory.' },
  { icon: '↔', title: 'Word Order', detail: 'Pay attention to the order each word appears.' },
  { icon: '…', title: 'Missing Words', detail: 'Remember the words hidden from a sentence.' },
  { icon: '123', title: 'Sequence Memory', detail: 'Recall numbers, words, and objects in order.' },
]

export default function MemoryHome({ onStart, onDashboard, onBack }) {
  return (
    <section className="memory-home">
      <button className="back-button memory-back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Maths Challenge
      </button>
      <div className="eyebrow"><span className="eyebrow-dot" /> MEMORY TRAINING</div>
      <h1 className="page-title">Make a moment<br className="desktop-break" /> worth remembering.</h1>
      <p className="page-description">A few focused exercises for attention, recall, and word order.</p>

      <div className="memory-home-grid">
        {exercises.map((exercise) => (
          <div className="memory-home-card" key={exercise.title}>
            <span className="memory-exercise-icon" aria-hidden="true">{exercise.icon}</span>
            <strong>{exercise.title}</strong>
            <span>{exercise.detail}</span>
          </div>
        ))}
      </div>

      <div className="memory-home-actions">
        <button className="primary-button" type="button" onClick={onStart}>
          Choose an exercise <span aria-hidden="true">→</span>
        </button>
        <button className="secondary-button" type="button" onClick={onDashboard}>
          View memory progress
        </button>
      </div>
      <p className="quiet-note"><span aria-hidden="true">✦</span> Practice is for reflection, not a measure of your ability.</p>
    </section>
  )
}
