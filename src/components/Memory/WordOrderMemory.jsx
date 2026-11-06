import { useState } from 'react'

export default function WordOrderMemory({ question, onSubmit }) {
  const [selected, setSelected] = useState([])
  const [shuffled] = useState(() => shuffleIndexes(question.tokens.length))

  function handleDrop(event, targetIndex = selected.length) {
    event.preventDefault()
    const raw = event.dataTransfer.getData('text/plain')
    if (!raw) return
    const dragged = JSON.parse(raw)
    if (dragged.source === 'pool') {
      if (selected.includes(dragged.index)) return
      const next = [...selected]
      next.splice(targetIndex, 0, dragged.index)
      setSelected(next)
    } else if (dragged.source === 'answer') {
      const next = [...selected]
      const [moved] = next.splice(dragged.index, 1)
      const insertionIndex = targetIndex > dragged.index ? targetIndex - 1 : targetIndex
      next.splice(Math.max(0, insertionIndex), 0, moved)
      setSelected(next)
    }
  }

  function toggleWord(index) {
    setSelected((current) => current.includes(index)
      ? current.filter((wordIndex) => wordIndex !== index)
      : [...current, index])
  }

  function moveWord(index, offset) {
    setSelected((current) => {
      const target = index + offset
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function submit(event) {
    event.preventDefault()
    onSubmit(selected.map((index) => question.tokens[index]))
  }

  const remaining = shuffled.filter((index) => !selected.includes(index))

  return (
    <form className="memory-recall-form" onSubmit={submit}>
      <p className="memory-instruction">Tap words to add them to your sentence. Tap an answer word to return it.</p>
      <div className="memory-answer-area" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event)}>
        {selected.length ? selected.map((wordIndex, index) => (
          <div className="memory-arranged-word" key={wordIndex} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index)}>
            <button
              type="button"
              className="memory-word-chip arranged"
              draggable
              onDragStart={(event) => event.dataTransfer.setData('text/plain', JSON.stringify({ source: 'answer', index }))}
              onClick={() => toggleWord(wordIndex)}
              aria-label={`Remove ${question.tokens[wordIndex]} from your answer`}
            >
              {question.tokens[wordIndex]}
            </button>
            <span className="memory-move-controls">
              <button type="button" aria-label="Move word left" disabled={index === 0} onClick={() => moveWord(index, -1)}>←</button>
              <button type="button" aria-label="Move word right" disabled={index === selected.length - 1} onClick={() => moveWord(index, 1)}>→</button>
            </span>
          </div>
        )) : <span className="memory-answer-placeholder">Your remembered order will appear here</span>}
      </div>
      <div className="memory-word-bank" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
        event.preventDefault()
        const dragged = JSON.parse(event.dataTransfer.getData('text/plain') || '{}')
        if (dragged.source === 'answer') setSelected((current) => current.filter((_, index) => index !== dragged.index))
      }}>
        {remaining.map((wordIndex) => (
          <button
            type="button"
            className="memory-word-chip"
            key={wordIndex}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', JSON.stringify({ source: 'pool', index: wordIndex }))}
            onClick={() => toggleWord(wordIndex)}
          >
            {question.tokens[wordIndex]}
          </button>
        ))}
      </div>
      <button className="primary-button memory-submit" type="submit" disabled={selected.length !== question.tokens.length}>
        Check my answer <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}

function shuffleIndexes(length) {
  const indexes = Array.from({ length }, (_, index) => index)
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1))
    ;[indexes[index], indexes[random]] = [indexes[random], indexes[index]]
  }
  if (indexes.every((value, index) => value === index) && indexes.length > 1) indexes.push(indexes.shift())
  return indexes
}
