import { useEffect, useRef } from 'react'
import type { TimelineStreamPort, PaneSnapshot } from '../domain/ports'
import type { TimelineItem } from '../domain/timeline'

export interface StreamCallbacks {
  onOpen: () => void
  onPanes: (snap: PaneSnapshot) => void
  onTurn: (t: TimelineItem) => void
  onError: () => void
}

export function useStream(
  stream: TimelineStreamPort,
  wsId: string | null,
  callbacks: StreamCallbacks,
) {
  const ref = useRef(callbacks)
  ref.current = callbacks

  useEffect(() => {
    if (!wsId) return
    return stream.connect(
      wsId,
      () => ref.current.onOpen(),
      (evt) => {
        if (evt.type === 'pane.updated') ref.current.onPanes(evt.data)
        else if (evt.type === 'turn.updated') ref.current.onTurn(evt.data)
      },
      () => ref.current.onError(),
    )
  }, [stream, wsId])
}
