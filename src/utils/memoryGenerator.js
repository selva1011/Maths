const subjects = ['Mia', 'The young artist', 'A curious student', 'The friendly baker', 'A thoughtful traveler']
const actions = [
  'found a bright red kite',
  'packed three small notebooks',
  'noticed a silver key',
  'carried a basket of ripe pears',
  'painted a cheerful blue bird',
  'picked up a smooth green stone',
]
const places = [
  'beside the old stone bridge',
  'near the quiet garden gate',
  'under the tall oak tree',
  'next to the little bookshop',
  'along the sunny country path',
]
const easySentences = [
  'Mia found a red kite by the river.',
  'Sam carried a blue book to school.',
  'A small cat slept beside the warm fire.',
  'The green train stopped near the park.',
  'Lena picked three apples from the tree.',
  'A yellow bird sang above the garden.',
  'Noah placed his shoes beside the door.',
  'The baker made fresh bread this morning.',
]
const fillerWords = ['quietly', 'carefully', 'before', 'after', 'because', 'while', 'nearby', 'outside', 'early', 'together']
const sequenceWords = ['Gentle', 'Across', 'Bright', 'Because', 'Morning', 'Quietly', 'Beyond', 'Always', 'Perhaps', 'Wonder', 'Follow', 'Between', 'Suddenly', 'Remember', 'Careful', 'Together']
const sequenceObjects = ['Apple', 'Train', 'Book', 'Orange', 'Chair', 'River', 'Lantern', 'Guitar', 'Cloud', 'Button', 'Garden', 'Window', 'Pencil', 'Castle', 'Pocket', 'Basket']

const difficultySettings = {
  Easy: { minWords: 7, sequenceLength: 4, missingCount: 2 },
  Medium: { minWords: 11, sequenceLength: 6, missingCount: 3 },
  Hard: { minWords: 16, sequenceLength: 8, missingCount: 4 },
  Expert: { minWords: 21, sequenceLength: 10, missingCount: 5 },
}

const exerciseNames = {
  sentence: 'Sentence Memory',
  wordOrder: 'Word Order Memory',
  missingWords: 'Missing Words',
  sequence: 'Sequence Memory',
}

function randomInt(max) {
  return Math.floor(Math.random() * max)
}

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = randomInt(index + 1)
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  if (shuffled.length > 1 && shuffled.every((item, index) => item === items[index])) {
    shuffled.push(shuffled.shift())
  }
  return shuffled
}

function createSentence(difficulty) {
  const settings = difficultySettings[difficulty]
  if (difficulty === 'Easy' && Math.random() < 0.65) return easySentences[randomInt(easySentences.length)]

  const sentenceParts = [
    subjects[randomInt(subjects.length)],
    actions[randomInt(actions.length)],
    places[randomInt(places.length)],
  ]
  let sentence = `${sentenceParts[0]} ${sentenceParts[1]} ${sentenceParts[2]}.`

  while (sentence.split(/\s+/).length < settings.minWords) {
    const phrase = difficulty === 'Expert'
      ? 'before the village clock struck midnight'
      : difficulty === 'Hard'
        ? 'as the evening sunlight faded'
        : 'before the sun went down'
    sentence = `${sentence.slice(0, -1)} ${phrase}.`
  }

  const words = sentence.slice(0, -1).split(/\s+/)
  let fillerIndex = 0
  while (words.length < settings.minWords) {
    words.splice(Math.max(1, words.length - 2), 0, fillerWords[fillerIndex % fillerWords.length])
    fillerIndex += 1
  }
  return `${words.join(' ')}.`
}

function createSequence(difficulty, questionIndex) {
  const length = difficultySettings[difficulty].sequenceLength
  const category = ['numbers', 'words', 'objects'][questionIndex % 3]
  let items

  if (category === 'numbers') {
    const start = randomInt(15) + 1
    const step = randomInt(difficulty === 'Easy' ? 4 : 9) + 1
    items = Array.from({ length }, (_, index) => String(start + index * step))
  } else {
    items = shuffle(category === 'words' ? sequenceWords : sequenceObjects).slice(0, length)
  }

  return {
    type: 'sequence',
    category,
    prompt: category === 'numbers'
      ? 'Remember these numbers in order'
      : `Remember these ${category} in order`,
    display: items,
    tokens: items,
  }
}

function createMemoryQuestion(exerciseType, difficulty, questionIndex) {
  if (!difficultySettings[difficulty]) throw new Error(`Unknown memory difficulty: ${difficulty}`)
  if (!exerciseNames[exerciseType]) throw new Error(`Unknown memory exercise: ${exerciseType}`)

  if (exerciseType === 'sequence') return createSequence(difficulty, questionIndex)

  const sentence = createSentence(difficulty)
  const tokens = sentence.match(/\S+/g) || []

  if (exerciseType === 'missingWords') {
    const candidateIndexes = tokens
      .map((word, index) => ({ word: normalizeWord(word), index }))
      .filter(({ word }) => word.length > 2)
      .map(({ index }) => index)
    const missingIndexes = shuffle(candidateIndexes).slice(0, Math.min(difficultySettings[difficulty].missingCount, candidateIndexes.length)).sort((a, b) => a - b)
    return { type: exerciseType, sentence, tokens, missingIndexes, prompt: 'Remember the sentence and its missing words' }
  }

  return {
    type: exerciseType,
    sentence,
    tokens,
    prompt: exerciseType === 'sentence' ? 'Read and remember the whole sentence' : 'Remember the exact word order',
  }
}

function normalizeWord(word) {
  return word.toLocaleLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
}

export function getMemoryExerciseName(exerciseType) {
  return exerciseNames[exerciseType] || exerciseType
}

export function getMemoryDifficultySettings(difficulty) {
  const settings = difficultySettings[difficulty]
  if (!settings) throw new Error(`Unknown memory difficulty: ${difficulty}`)
  return { ...settings }
}

export function generateMemoryQuestions(exerciseType, difficulty, count) {
  if (!Number.isInteger(count) || count < 1) throw new Error('Question count must be a positive integer.')
  return Array.from({ length: count }, (_, index) => createMemoryQuestion(exerciseType, difficulty, index))
}

export function shuffleMemoryTokens(tokens) {
  return shuffle(tokens.map((_, index) => index))
}

export function normalizeMemoryWord(word) {
  return normalizeWord(word)
}
