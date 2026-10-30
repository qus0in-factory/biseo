import type { TimelineStreamPort as St } from '../domain/ports'
import type { TimelineItem } from '../domain/timeline'
import type { SyncHandlers } from '../domain/recoveryHandlers'
import { useStream } from './useStream'

export function useWorkspaceStream(
  s: St,
  on: boolean,
  wsId: string | null,
  update: (t: TimelineItem) => void,
  recovery: SyncHandlers,
  notify: (t: TimelineItem) => void,
) {
  useStream(s, on ? wsId : null, {
    ...recovery,
    onTurn: (t) => {
      update(t)
      notify(t)
    },
  })
}
