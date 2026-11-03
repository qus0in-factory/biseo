import { useEffect, useRef } from 'react'
import type { TimelineStreamPort, PaneSnapshot } from '../domain/ports'
import type { TimelineItem } from '../domain/timeline'
import { belongsToWorkspace } from './streamWorkspace'

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
    const active = wsId
    let closed = false
    const cleanup = stream.connect(
      active,
      () => {
        if (!closed) ref.current.onOpen()
      },
      (evt) => {
        if (closed || !belongsToWorkspace(active, evt.data.workspaceId)) return
        if (evt.type === 'pane.updated') ref.current.onPanes(evt.data)
        else if (evt.type === 'turn.updated') ref.current.onTurn(evt.data)
      },
      () => {
        if (!closed) ref.current.onError()
      },
    )
    return () => {
      closed = true
      cleanup()
    }
  }, [stream, wsId])
}
