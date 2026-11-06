const marks = [10, 20, 30, 50, 100]

export default function MarksSelection({ onSelect }) {
  return (
    <>
      <div className="eyebrow"><span className="eyebrow-dot" /> YOUR SESSION</div>
      <h1 className="page-title">How much would<br className="desktop-break" /> you like to practice?</h1>
      <p className="page-description">Choose a session length. Every question is worth one mark.</p>
      <div className="marks-grid">
        {marks.map((mark, index) => (
          <button
            className={`selection-card marks-card marks-card-${index}`}
            key={mark}
            onClick={() => onSelect(mark)}
          >
            <span className="marks-number">{mark}</span>
            <span className="marks-label">marks</span>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="quiet-note"><span aria-hidden="true">✦</span> No timer, no pressure. Just you and the numbers.</p>
    </>
  )
}
