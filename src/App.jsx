import { useEffect, useRef, useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import LevelSelection from './components/LevelSelection.jsx'
import MarksSelection from './components/MarksSelection.jsx'
import ParticipantSetup from './components/ParticipantSetup.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import useChallengeTimer from './hooks/useChallengeTimer.js'
import { createParticipant, createUniqueId, updateLastActive } from './utils/participant.js'
import { generateQuestionSet } from './utils/questionGenerator.js'
import { getChallengeResults, getParticipant, saveChallengeResult, saveParticipant } from './utils/storage.js'

function loadInitialData() {
  try {
    let participant = getParticipant()
    if (participant) {
      participant = updateLastActive(participant)
      saveParticipant(participant)
    }
    return {
      participant,
      results: getChallengeResults(),
      error: '',
    }
  } catch (error) {
    console.error('Unable to load local participant data.', error)
    return {
      participant: null,
      results: [],
      error: 'Browser storage is unavailable. Enable local storage to save your profile and challenge results.',
    }
  }
}

export default function App() {
  const [initialData] = useState(loadInitialData)
  const [screen, setScreen] = useState(initialData.participant ? 'marks' : 'setup')
  const [participant, setParticipant] = useState(initialData.participant)
  const [results, setResults] = useState(initialData.results)
  const [storageError, setStorageError] = useState(initialData.error)
  const [marks, setMarks] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [sessionNumber, setSessionNumber] = useState(0)
  const [totalTimeMs, setTotalTimeMs] = useState(0)
  const [dashboardReturnScreen, setDashboardReturnScreen] = useState('marks')
  const savedSessionRef = useRef(null)
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

  function registerParticipant(name) {
    try {
      const newParticipant = createParticipant(name)
      saveParticipant(newParticipant)
      setParticipant(newParticipant)
      setStorageError('')
      setScreen('marks')
    } catch (error) {
      console.error('Unable to save participant profile.', error)
      setStorageError(error instanceof Error ? error.message : 'Unable to save participant profile.')
    }
  }

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
    savedSessionRef.current = null
    challengeTimer.start()
    setScreen('practice')
  }

  function recordAnswer(isCorrect) {
    if (isCorrect) setCorrect((score) => score + 1)
    else setIncorrect((score) => score + 1)
  }

  function nextQuestion() {
    if (questionIndex + 1 === questions.length) {
      const finalTimeMs = challengeTimer.stop()
      setTotalTimeMs(finalTimeMs)
      if (savedSessionRef.current !== sessionNumber && participant) {
        savedSessionRef.current = sessionNumber
        try {
          const completedAt = new Date().toISOString()
          const accuracy = Math.round((correct / questions.length) * 100)
          const result = {
            id: createUniqueId(),
            participantId: participant.id,
            participantName: participant.name,
            marks,
            difficulty,
            totalQuestions: questions.length,
            correctAnswers: correct,
            incorrectAnswers: incorrect,
            accuracy,
            marksObtained: correct,
            totalTimeMs: finalTimeMs,
            completedAt,
          }
          setResults(saveChallengeResult(result))
          setStorageError('')
        } catch (error) {
          console.error('Unable to save completed challenge.', error)
          setStorageError('This challenge is complete, but its result could not be saved in browser storage.')
        }
      }
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

  function openDashboard() {
    if (screen === 'dashboard') {
      setScreen(dashboardReturnScreen)
      return
    }
    setDashboardReturnScreen(screen)
    setScreen('dashboard')
  }

  function returnFromDashboard() {
    setScreen(dashboardReturnScreen)
  }

  function goHome() {
    if (screen === 'practice' || (screen === 'dashboard' && dashboardReturnScreen === 'practice')) {
      challengeTimer.stop()
    }
    setScreen('marks')
    setMarks(null)
    setDifficulty(null)
  }

  const challengeVisible = screen === 'practice'
    || (screen === 'dashboard' && dashboardReturnScreen === 'practice')

  return (
    <main className={`app-shell ${screen === 'practice' ? 'challenge-active' : ''} ${screen === 'dashboard' ? 'dashboard-active' : ''}`}>
      <header className="topbar">
        <a
          href="#home"
          className="brand"
          onClick={(event) => {
            event.preventDefault()
            goHome()
          }}
          aria-label="Numberly home"
        >
          <span className="brand-mark" aria-hidden="true"><span>+</span><span>×</span></span>
          <span>numberly<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-actions">
          <span className="topbar-note">A little practice goes a long way <span aria-hidden="true">✦</span></span>
          {participant && (
            <button
              className={`dashboard-nav-button ${screen === 'dashboard' ? 'selected' : ''}`}
              type="button"
              onClick={openDashboard}
              aria-label={screen === 'dashboard' ? 'Return to previous screen' : 'Open dashboard'}
              title={screen === 'dashboard' ? 'Return to challenge' : 'Dashboard'}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2.5" y="2.5" width="6" height="6" rx="1.2" />
                <rect x="11.5" y="2.5" width="6" height="6" rx="1.2" />
                <rect x="2.5" y="11.5" width="6" height="6" rx="1.2" />
                <rect x="11.5" y="11.5" width="6" height="6" rx="1.2" />
              </svg>
              <span>{screen === 'dashboard' ? 'Back' : 'Dashboard'}</span>
            </button>
          )}
        </div>
      </header>

      <div className={`main-content ${screen === 'practice' ? 'practice-content' : ''} ${screen === 'dashboard' ? 'dashboard-main' : ''}`}>
        {screen === 'setup' && <ParticipantSetup onCreate={registerParticipant} error={storageError} />}
        {screen === 'marks' && <MarksSelection onSelect={chooseMarks} />}
        {screen === 'difficulty' && (
          <LevelSelection marks={marks} onSelect={startSession} onBack={() => setScreen('marks')} />
        )}
        {challengeVisible && (
          <div className={screen === 'dashboard' ? 'preserved-challenge' : undefined} aria-hidden={screen === 'dashboard'}>
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
              isVisible={screen === 'practice'}
            />
          </div>
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
        {screen === 'dashboard' && participant && (
          <Dashboard participant={participant} results={results} onReturn={returnFromDashboard} />
        )}
        {storageError && screen !== 'setup' && (
          <p className="storage-notice" role="status">{storageError}</p>
        )}
      </div>

      <footer className="site-footer">
        <span>Made for curious minds.</span>
        <span>Take it one question at a time <span aria-hidden="true">♡</span></span>
      </footer>
    </main>
  )
}
