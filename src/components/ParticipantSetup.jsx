import { useState } from 'react'

export default function ParticipantSetup({ onCreate, error }) {
  const [name, setName] = useState('')

  function submit(event) {
    event.preventDefault()
    const displayName = name.trim()
    if (displayName) onCreate(displayName)
  }

  return (
    <section className="setup-card">
      <div className="eyebrow"><span className="eyebrow-dot" /> WELCOME TO NUMBERLY</div>
      <h1 className="page-title">What should we<br className="desktop-break" /> call you?</h1>
      <p className="page-description">Choose a name for your challenge history and personal leaderboard.</p>
      <form className="setup-form" onSubmit={submit}>
        <label className="input-label" htmlFor="participant-name">Display name or nickname</label>
        <input
          id="participant-name"
          className="setup-input"
          type="text"
          autoComplete="nickname"
          maxLength={32}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Alex"
          required
          autoFocus
        />
        {error && <p className="storage-error" role="alert">{error}</p>}
        <button className="primary-button setup-submit" type="submit" disabled={!name.trim()}>
          Let’s get started <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="quiet-note"><span aria-hidden="true">✦</span> Your name and progress stay in this browser only.</p>
    </section>
  )
}
