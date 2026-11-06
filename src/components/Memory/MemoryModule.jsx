import { useRef, useState } from 'react'
import MemoryDashboard from './MemoryDashboard.jsx'
import MemoryExercise from './MemoryExercise.jsx'
import MemoryHome from './MemoryHome.jsx'
import MemoryResults from './MemoryResults.jsx'
import MemorySetup from './MemorySetup.jsx'
import { createUniqueId } from '../../utils/participant.js'
import { saveMemorySession, getMemorySessions } from '../../utils/memoryStorage.js'

export default function MemoryModule({ participantId, onBack }) {
  const [screen, setScreen] = useState('home')
  const [sessions, setSessions] = useState(() => {
    try {
      return getMemorySessions(participantId)
    } catch (error) {
      console.error('Unable to load memory practice history.', error)
      return []
    }
  })
  const [config, setConfig] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [completedSession, setCompletedSession] = useState(null)
  const [storageError, setStorageError] = useState('')
  const sessionStartTimeRef = useRef(0)

  function startSession(nextConfig) {
    try {
      setConfig(nextConfig)
      setSessionId(createUniqueId())
      setStorageError('')
      setScreen('exercise')
    } catch (error) {
      console.error('Unable to start a memory practice session.', error)
      setStorageError('Secure session ID generation is unavailable in this browser.')
    }
  }

  function finishSession(summary) {
    const completedAt = new Date().toISOString()
    const session = {
      id: sessionId,
      participantId,
      ...config,
      ...summary,
      totalDurationMs: sessionStartTimeRef.current ? Date.now() - sessionStartTimeRef.current : 0,
      completedAt,
    }
    setCompletedSession(session)
    try {
      const updatedSessions = saveMemorySession(session)
      setSessions(updatedSessions.filter((savedSession) => savedSession.participantId === participantId))
      setStorageError('')
    } catch (error) {
      console.error('Unable to save completed memory practice session.', error)
      setStorageError('Your results are shown, but browser storage could not save this session.')
    }
    setScreen('results')
  }

  function beginSession(nextConfig) {
    sessionStartTimeRef.current = Date.now()
    startSession(nextConfig)
  }

  if (screen === 'home') {
    return (
      <>
        <MemoryHome onStart={() => setScreen('setup')} onDashboard={() => setScreen('dashboard')} onBack={onBack} />
        {storageError && <p className="storage-notice" role="status">{storageError}</p>}
      </>
    )
  }

  if (screen === 'setup') {
    return (
      <>
        <MemorySetup sessions={sessions} onStart={beginSession} onBack={() => setScreen('home')} />
        {storageError && <p className="storage-notice" role="status">{storageError}</p>}
      </>
    )
  }

  if (screen === 'exercise') {
    return <MemoryExercise key={sessionId} config={config} onComplete={finishSession} onExit={() => setScreen('setup')} />
  }

  if (screen === 'results' && completedSession) {
    return (
      <>
        <MemoryResults
          session={completedSession}
          onAgain={() => setScreen('setup')}
          onDashboard={() => setScreen('dashboard')}
          onHome={() => setScreen('home')}
        />
        {storageError && <p className="storage-notice" role="status">{storageError}</p>}
      </>
    )
  }

  return <MemoryDashboard sessions={sessions} onBack={() => setScreen('home')} onStart={() => setScreen('setup')} />
}
