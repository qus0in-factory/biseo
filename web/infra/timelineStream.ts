import type { SseEventHandler, TimelineStreamPort } from '../domain/ports'

export const timelineStream: TimelineStreamPort = {
  connect(
    workspaceId: string,
    onOpen: () => void,
    onEvent: SseEventHandler,
    onError: () => void,
  ) {
    const url = `/api/timeline/stream?workspaceId=${encodeURIComponent(workspaceId)}`
    const es = new EventSource(url, { withCredentials: true })

    es.onopen = () => {
      onOpen()
    }

    es.addEventListener('pane.updated', (e) => {
      try {
        const data = JSON.parse(e.data)
        onEvent({ type: 'pane.updated', data })
      } catch {
        // ignore parse error
      }
    })

    es.addEventListener('turn.updated', (e) => {
      try {
        const data = JSON.parse(e.data)
        onEvent({ type: 'turn.updated', data })
      } catch {
        // ignore parse error
      }
    })

    es.onerror = () => {
      onError()
    }

    return () => {
      es.close()
    }
  },
}
