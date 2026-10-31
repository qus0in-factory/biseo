import type { TimelineStreamPort } from '../domain/ports'
import type { TimelineItem } from '../domain/timeline'
import type { SyncHandlers } from '../domain/recoveryHandlers'
import { useStream } from './useStream'

export function useWorkspaceStream(
  s: TimelineStreamPort,
  on: boolean,
  wsId: string | null,
  update: (t: TimelineItem) => void,
  recovery: SyncHandlers,
) {
  useStream(s, on ? wsId : null, {
    ...recovery,
    onTurn: update,
  })
}
