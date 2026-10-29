import type { SseEventHandler, TimelineStreamPort } from '../domain/ports'
import { createRetryScheduler } from '../domain/retryScheduler'
import { openSse } from './sseSource'
import { bindStreamLifecycle } from './streamLifecycle'

export const timelineStream: TimelineStreamPort = {
  connect(wsId, onOpen, onEvent, onError) {
    let es: EventSource | null = null
    let closed = false
    const sched = createRetryScheduler(() => start())

    const stop = () => {
      sched.cancel()
      es?.close()
      es = null
    }

    const start = () => {
      if (closed) return
      stop()
      es = openSse(
        wsId,
        () => (sched.reset(), onOpen()),
        onEvent,
        () => closed || (onError(), stop(), sched.schedule()),
      )
    }

    start()
    const unbind = bindStreamLifecycle(() => closed || (sched.reset(), start()))

    return () => {
      closed = true
      stop()
      unbind()
    }
  },
}
