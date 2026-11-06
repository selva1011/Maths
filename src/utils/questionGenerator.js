const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (items) => items[randomInt(0, items.length - 1)]

function makeQuestion(left, operator, right, answer, extra = '') {
  const prompt = `${left} ${operator} ${right}${extra} = ?`
  return { prompt, answer, key: prompt }
}

function generateEasy() {
  const operator = pick(['+', '−', '×', '÷'])

  if (operator === '+') {
    const left = randomInt(1, 9)
    const right = randomInt(1, 9)
    return makeQuestion(left, operator, right, left + right)
  }
  if (operator === '−') {
    const left = randomInt(2, 9)
    const right = randomInt(1, left)
    return makeQuestion(left, operator, right, left - right)
  }
  if (operator === '×') {
    const left = randomInt(2, 9)
    const right = randomInt(2, 9)
    return makeQuestion(left, operator, right, left * right)
  }

  const answer = randomInt(2, 9)
  const divisor = randomInt(2, 9)
  return makeQuestion(answer * divisor, operator, divisor, answer)
}

function generateMedium() {
  const operator = pick(['+', '−', '×', '÷', 'mixed'])

  if (operator === '+') {
    const left = randomInt(10, 99)
    const right = randomInt(10, 99)
    return makeQuestion(left, '+', right, left + right)
  }
  if (operator === '−') {
    const left = randomInt(20, 99)
    const right = randomInt(10, left)
    return makeQuestion(left, '−', right, left - right)
  }
  if (operator === '×') {
    const left = randomInt(2, 12)
    const right = randomInt(2, 12)
    return makeQuestion(left, '×', right, left * right)
  }
  if (operator === '÷') {
    const answer = randomInt(5, 25)
    const divisor = randomInt(2, 12)
    return makeQuestion(answer * divisor, '÷', divisor, answer)
  }

  const left = randomInt(10, 30)
  const middle = randomInt(2, 9)
  const right = randomInt(1, 20)
  const operation = pick(['+', '−', '×'])
  const answer = operation === '+' ? left + middle + right : operation === '−' ? left - middle + right : left * middle + right
  const prompt = `(${left} ${operation} ${middle}) + ${right} = ?`
  return { prompt, answer, key: prompt }
}

function generateHard() {
  const operator = pick(['+', '−', '×', '÷', 'multi'])

  if (operator === '+') {
    const left = randomInt(100, 999)
    const right = randomInt(100, 999)
    return makeQuestion(left, '+', right, left + right)
  }
  if (operator === '−') {
    const left = randomInt(200, 999)
    const right = randomInt(100, left)
    return makeQuestion(left, '−', right, left - right)
  }
  if (operator === '×') {
    const left = randomInt(12, 99)
    const right = randomInt(12, 99)
    return makeQuestion(left, '×', right, left * right)
  }
  if (operator === '÷') {
    const answer = randomInt(12, 99)
    const divisor = randomInt(3, 25)
    return makeQuestion(answer * divisor, '÷', divisor, answer)
  }

  const left = randomInt(20, 99)
  const middle = randomInt(2, 12)
  const right = randomInt(10, 50)
  const answer = left + middle * right
  const prompt = `${left} + (${middle} × ${right}) = ?`
  return { prompt, answer, key: prompt }
}

const generators = {
  Easy: generateEasy,
  Medium: generateMedium,
  Hard: generateHard,
}

export function generateQuestion(difficulty) {
  const generator = generators[difficulty]
  if (!generator) {
    throw new Error(`Unknown difficulty: ${difficulty}`)
  }
  return generator()
}

export function generateQuestionSet(difficulty, count) {
  const questions = []
  const seen = new Set()
  const maxAttempts = count * 20

  while (questions.length < count && seen.size < maxAttempts) {
    const question = generateQuestion(difficulty)
    if (!seen.has(question.key)) {
      seen.add(question.key)
      questions.push(question)
    }
  }

  return questions
}
