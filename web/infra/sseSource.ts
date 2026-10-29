import type { SseEventHandler } from '../domain/ports'

export function openSse(
  wsId: string,
  onOpen: () => void,
  onEvent: SseEventHandler,
  onError: () => void,
): EventSource {
  const url = `/api/timeline/stream?workspaceId=${encodeURIComponent(wsId)}`
  const es = new EventSource(url, { withCredentials: true })
  es.onopen = onOpen
  es.addEventListener('pane.updated', (e) => {
    try {
      onEvent({ type: 'pane.updated', data: JSON.parse(e.data) })
    } catch {}
  })
  es.addEventListener('turn.updated', (e) => {
    try {
      onEvent({ type: 'turn.updated', data: JSON.parse(e.data) })
    } catch {}
  })
  es.onerror = onError
  return es
}
