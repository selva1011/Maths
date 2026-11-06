function getDeviceType(userAgent, maxTouchPoints) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)) {
    return 'tablet'
  }
  if (/Mobi|iPhone|iPod|Android/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function getBrowserName(userAgent) {
  if (/Edg\//i.test(userAgent)) return 'Microsoft Edge'
  if (/OPR\//i.test(userAgent)) return 'Opera'
  if (/CriOS\//i.test(userAgent)) return 'Chrome'
  if (/FxiOS\//i.test(userAgent)) return 'Firefox'
  if (/Chrome\//i.test(userAgent)) return 'Chrome'
  if (/Firefox\//i.test(userAgent)) return 'Firefox'
  if (/Safari\//i.test(userAgent)) return 'Safari'
  return 'Unknown'
}

function getOperatingSystem(userAgent, maxTouchPoints) {
  if (/Windows/i.test(userAgent)) return 'Windows'
  if (/Android/i.test(userAgent)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'iPadOS'
  if (/Mac OS X|Macintosh/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(userAgent)) return 'Linux'
  return 'Unknown'
}

export function createParticipant(name, now = new Date()) {
  const userAgent = navigator.userAgent || ''
  return {
    id: createUniqueId(),
    name: name.trim(),
    deviceType: getDeviceType(userAgent, navigator.maxTouchPoints || 0),
    browser: getBrowserName(userAgent),
    operatingSystem: getOperatingSystem(userAgent, navigator.maxTouchPoints || 0),
    firstVisit: now.toISOString(),
    lastActive: now.toISOString(),
  }
}

export function createUniqueId() {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error('Secure ID generation is unavailable in this browser.')
  }
  return globalThis.crypto.randomUUID()
}

export function updateLastActive(participant, now = new Date()) {
  return { ...participant, lastActive: now.toISOString() }
}
