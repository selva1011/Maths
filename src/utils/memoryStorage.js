const MEMORY_RESULTS_KEY = 'memory_training_sessions'

function readSessions() {
  const serialized = window.localStorage.getItem(MEMORY_RESULTS_KEY)
  if (serialized === null) return []

  try {
    const sessions = JSON.parse(serialized)
    if (!Array.isArray(sessions)) {
      console.warn('Ignoring invalid memory training session data.')
      return []
    }
    return sessions.filter((session) => session && typeof session.id === 'string')
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('Ignoring malformed memory training session data.', error)
      return []
    }
    throw error
  }
}

export function getMemorySessions(participantId) {
  const sessions = readSessions()
  return participantId ? sessions.filter((session) => session.participantId === participantId) : sessions
}

export function saveMemorySession(session) {
  const sessions = readSessions()
  if (sessions.some((savedSession) => savedSession.id === session.id)) return sessions

  const updatedSessions = [...sessions, session]
  window.localStorage.setItem(MEMORY_RESULTS_KEY, JSON.stringify(updatedSessions))
  return updatedSessions
}
