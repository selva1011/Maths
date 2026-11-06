import { useEffect, useState } from 'react'
import MarksSelection from './components/MarksSelection.jsx'
import LevelSelection from './components/LevelSelection.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import useChallengeTimer from './hooks/useChallengeTimer.js'
import { generateQuestionSet } from './utils/questionGenerator.js'

export default function App() {
  const [screen, setScreen] = useState('marks')
  const [marks, setMarks] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [sessionNumber, setSessionNumber] = useState(0)
  const [totalTimeMs, setTotalTimeMs] = useState(0)
  const challengeTimer = useChallengeTimer()

  useEffect(() => {
    if (screen !== 'practice') return undefined

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [screen])

  function chooseMarks(selectedMarks) {
    setMarks(selectedMarks)
    setScreen('difficulty')
  }

  function startSession(selectedDifficulty) {
    setDifficulty(selectedDifficulty)
    setQuestions(generateQuestionSet(selectedDifficulty, marks))
    setSessionNumber((number) => number + 1)
    setQuestionIndex(0)
    setCorrect(0)
    setIncorrect(0)
    setTotalTimeMs(0)
    challengeTimer.start()
    setScreen('practice')
  }

  function recordAnswer(isCorrect) {
    if (isCorrect) setCorrect((score) => score + 1)
    else setIncorrect((score) => score + 1)
  }

  function nextQuestion() {
    if (questionIndex + 1 === questions.length) {
      setTotalTimeMs(challengeTimer.stop())
      setScreen('results')
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  function tryAgain() {
    startSession(difficulty)
  }

  function goToDifficulty() {
    challengeTimer.stop()
    setScreen('difficulty')
  }

  return (
    <main className={`app-shell ${screen === 'practice' ? 'challenge-active' : ''}`}>
      <header className="topbar">
        <a
          href="#home"
          className="brand"
          onClick={(event) => {
            event.preventDefault()
            challengeTimer.stop()
            setScreen('marks')
            setMarks(null)
            setDifficulty(null)
          }}
          aria-label="Numberly home"
        >
          <span className="brand-mark" aria-hidden="true"><span>+</span><span>×</span></span>
          <span>numberly<span className="brand-period">.</span></span>
        </a>
        <span className="topbar-note">A little practice goes a long way <span aria-hidden="true">✦</span></span>
      </header>

      <div className={`main-content ${screen === 'practice' ? 'practice-content' : ''}`}>
        {screen === 'marks' && <MarksSelection onSelect={chooseMarks} />}
        {screen === 'difficulty' && (
          <LevelSelection marks={marks} onSelect={startSession} onBack={() => setScreen('marks')} />
        )}
        {screen === 'practice' && (
          <QuestionScreen
            key={sessionNumber}
            marks={marks}
            difficulty={difficulty}
            questions={questions}
            questionIndex={questionIndex}
            correct={correct}
            incorrect={incorrect}
            onAnswer={recordAnswer}
            onNext={nextQuestion}
            onExit={goToDifficulty}
            elapsedMs={challengeTimer.elapsedMs}
          />
        )}
        {screen === 'results' && (
          <ResultScreen
            marks={marks}
            difficulty={difficulty}
            total={questions.length}
            correct={correct}
            incorrect={incorrect}
            totalTimeMs={totalTimeMs}
            onTryAgain={tryAgain}
            onChangeDifficulty={goToDifficulty}
          />
        )}
      </div>

      <footer className="site-footer">
        <span>Made for curious minds.</span>
        <span>Take it one question at a time <span aria-hidden="true">♡</span></span>
      </footer>
    </main>
  )
}
