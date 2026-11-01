const streamOpenEvent = 'biseo:stream-open'

export function notifyStreamOpen(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(streamOpenEvent))
}

export function onStreamOpen(run: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(streamOpenEvent, run)
  return () => window.removeEventListener(streamOpenEvent, run)
}
