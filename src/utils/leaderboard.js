const difficultyLevels = ['Easy', 'Medium', 'Hard']

function compareResults(left, right) {
  return right.marksObtained - left.marksObtained
    || right.accuracy - left.accuracy
    || left.totalTimeMs - right.totalTimeMs
    || left.completedAt.localeCompare(right.completedAt)
    || left.id.localeCompare(right.id)
}

export function getBestResultsByDifficulty(results, difficulty) {
  const bestByParticipant = new Map()

  for (const result of results) {
    if (result.difficulty !== difficulty) continue
    const currentBest = bestByParticipant.get(result.participantId)
    if (!currentBest || compareResults(result, currentBest) < 0) {
      bestByParticipant.set(result.participantId, result)
    }
  }

  return [...bestByParticipant.values()].sort(compareResults)
}

export function getLeaderboard(results, difficulty, limit = 5) {
  return getBestResultsByDifficulty(results, difficulty)
    .slice(0, limit)
    .map((result, index) => ({ ...result, rank: index + 1 }))
}

export function getOrdinal(rank) {
  const lastTwoDigits = rank % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${rank}th`
  if (rank % 10 === 1) return `${rank}st`
  if (rank % 10 === 2) return `${rank}nd`
  if (rank % 10 === 3) return `${rank}rd`
  return `${rank}th`
}

export function getDashboardSummary(results, participant) {
  const participantIds = new Set(results.map((result) => result.participantId))
  if (participant?.id) participantIds.add(participant.id)
  const correctAnswers = results.reduce((sum, result) => sum + result.correctAnswers, 0)
  const averageAccuracy = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length)
    : 0

  return {
    totalParticipants: participantIds.size,
    totalChallenges: results.length,
    correctAnswers,
    averageAccuracy,
  }
}

export function getParticipantStats(results, participantId) {
  const participantResults = results
    .filter((result) => result.participantId === participantId)
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
  const bestScores = Object.fromEntries(
    difficultyLevels.map((difficulty) => [
      difficulty,
      getBestResultsByDifficulty(participantResults, difficulty)[0] || null,
    ]),
  )

  return {
    totalChallenges: participantResults.length,
    bestScores,
    averageAccuracy: participantResults.length
      ? Math.round(participantResults.reduce((sum, result) => sum + result.accuracy, 0) / participantResults.length)
      : 0,
    recentResults: participantResults.slice(0, 5),
  }
}
