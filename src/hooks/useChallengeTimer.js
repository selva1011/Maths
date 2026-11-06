import { useEffect, useRef, useState } from 'react'

export function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function useChallengeTimer() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startedAtRef = useRef(null)

  useEffect(() => {
    if (!isRunning) return undefined

    const updateElapsed = () => {
      if (startedAtRef.current !== null) {
        setElapsedMs(Date.now() - startedAtRef.current)
      }
    }

    const intervalId = window.setInterval(updateElapsed, 1000)
    document.addEventListener('visibilitychange', updateElapsed)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', updateElapsed)
    }
  }, [isRunning])

  function start() {
    startedAtRef.current = Date.now()
    setElapsedMs(0)
    setIsRunning(true)
  }

  function stop() {
    if (startedAtRef.current === null) return elapsedMs

    const finalElapsedMs = Date.now() - startedAtRef.current
    startedAtRef.current = null
    setElapsedMs(finalElapsedMs)
    setIsRunning(false)
    return finalElapsedMs
  }

  return { elapsedMs, start, stop }
}
