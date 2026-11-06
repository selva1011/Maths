import WordOrderMemory from './WordOrderMemory.jsx'

export default function SequenceMemory({ question, onSubmit }) {
  return (
    <div className="sequence-recall">
      <p className="memory-instruction">Tap or drag the {question.category} into the remembered order.</p>
      <WordOrderMemory question={question} onSubmit={onSubmit} />
    </div>
  )
}
