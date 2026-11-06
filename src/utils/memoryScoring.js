import { normalizeMemoryWord } from './memoryGenerator.js'

export function scoreMemoryAnswer(originalTokens, answerTokens) {
  const totalWords = originalTokens.length
  const originalNormalized = originalTokens.map(normalizeMemoryWord)
  const answerNormalized = answerTokens.map(normalizeMemoryWord)
  const counts = new Map()

  for (const word of originalNormalized) {
    counts.set(word, (counts.get(word) || 0) + 1)
  }

  let wordsRemembered = 0
  for (const word of answerNormalized) {
    const available = counts.get(word) || 0
    if (available > 0) {
      wordsRemembered += 1
      counts.set(word, available - 1)
    }
  }

  const correctPositions = originalNormalized.reduce(
    (total, word, index) => total + (answerNormalized[index] === word ? 1 : 0),
    0,
  )

  return {
    totalWords,
    wordsRemembered,
    correctPositions,
    recallAccuracy: totalWords ? Math.round((wordsRemembered / totalWords) * 100) : 0,
    wordOrderAccuracy: totalWords ? Math.round((correctPositions / totalWords) * 100) : 0,
    isExact: answerNormalized.length === totalWords && correctPositions === totalWords,
  }
}

export function scoreMissingWords(originalTokens, answerTokens, missingIndexes) {
  const score = scoreMemoryAnswer(originalTokens, answerTokens)
  const wordsRemembered = missingIndexes.reduce((total, index) => (
    total + (normalizeMemoryWord(answerTokens[index] || '') === normalizeMemoryWord(originalTokens[index]) ? 1 : 0)
  ), 0)
  const totalWords = missingIndexes.length

  return {
    ...score,
    totalWords,
    wordsRemembered,
    recallAccuracy: totalWords ? Math.round((wordsRemembered / totalWords) * 100) : 0,
    isExact: wordsRemembered === totalWords && score.isExact,
  }
}

export function summarizeMemorySession(questionResults) {
  const totalQuestions = questionResults.length
  const correctAnswers = questionResults.filter((result) => result.isExact).length
  const incorrectAnswers = totalQuestions - correctAnswers
  const accuracy = totalQuestions
    ? Math.round(questionResults.reduce((sum, result) => sum + result.recallAccuracy, 0) / totalQuestions)
    : 0
  const wordOrderAccuracy = totalQuestions
    ? Math.round(questionResults.reduce((sum, result) => sum + result.wordOrderAccuracy, 0) / totalQuestions)
    : 0
  const averageResponseTimeMs = totalQuestions
    ? Math.round(questionResults.reduce((sum, result) => sum + result.responseTimeMs, 0) / totalQuestions)
    : 0

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    wordOrderAccuracy,
    averageResponseTimeMs,
    performanceScore: Math.round(accuracy * 0.6 + wordOrderAccuracy * 0.4),
  }
}

export function getNextDifficultyRecommendation(sessions, exerciseType, currentDifficulty) {
  const levels = ['Easy', 'Medium', 'Hard', 'Expert']
  const currentIndex = levels.indexOf(currentDifficulty)
  if (currentIndex < 0) return { level: 'Easy', reason: 'Start with an easy session and see how it feels.' }

  const recent = sessions
    .filter((session) => session.exerciseType === exerciseType)
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
    .slice(0, 3)

  if (!recent.length) return { level: currentDifficulty, reason: 'Try a session first to build a recommendation from your results.' }

  const average = Math.round(recent.reduce((sum, session) => sum + session.accuracy, 0) / recent.length)
  if (average >= 85 && currentIndex < levels.length - 1) {
    return { level: levels[currentIndex + 1], reason: `Your recent ${average}% average suggests you could try the next level.` }
  }
  if (average < 60 && currentIndex > 0) {
    return { level: levels[currentIndex - 1], reason: `A gentler level may feel more comfortable after your recent ${average}% average.` }
  }
  return { level: currentDifficulty, reason: `Your recent ${average}% average suggests staying at this level for now.` }
}
