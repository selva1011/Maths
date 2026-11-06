const PARTICIPANT_KEY = 'maths_participant'
const RESULTS_KEY = 'maths_challenge_results'

function readJSON(key, fallback) {
  const serialized = window.localStorage.getItem(key)
  if (serialized === null) return fallback

  try {
    return JSON.parse(serialized)
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`Ignoring invalid local data stored at "${key}".`, error)
      return fallback
    }
    throw error
  }
}

export function getParticipant() {
  const participant = readJSON(PARTICIPANT_KEY, null)
  if (!participant || typeof participant !== 'object' || typeof participant.id !== 'string') return null
  return participant
}

export function saveParticipant(participant) {
  window.localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(participant))
  return participant
}

export function getChallengeResults() {
  const results = readJSON(RESULTS_KEY, [])
  if (!Array.isArray(results)) {
    console.warn(`Ignoring invalid local data stored at "${RESULTS_KEY}".`)
    return []
  }
  return results.filter((result) => result && typeof result.id === 'string' && typeof result.participantId === 'string')
}

export function saveChallengeResult(result) {
  const results = getChallengeResults()
  if (results.some((savedResult) => savedResult.id === result.id)) return results

  const updatedResults = [...results, result]
  window.localStorage.setItem(RESULTS_KEY, JSON.stringify(updatedResults))
  return updatedResults
}
