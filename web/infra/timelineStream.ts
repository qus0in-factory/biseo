import type { TimelineStreamPort } from '../domain/ports'
import { connectTimelineStream } from './timelineStreamSession'

export const timelineStream: TimelineStreamPort = {
  connect(wsId, onOpen, onEvent, onError) {
    return connectTimelineStream(wsId, onOpen, onEvent, onError)
  },
}
