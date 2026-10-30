import type { TimelineStreamPort as St } from '../domain/ports'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import type { SyncHandlers } from '../domain/recoveryHandlers'
import { useNotificationFeed } from './useNotificationFeed'
import { useStream } from './useStream'
import { useUiStore } from './uiStore'

export function useWorkspaceStream(
  s: St,
  on: boolean,
  wsId: string | null,
  panes: PaneSummary[],
  update: (t: TimelineItem) => void,
  recovery: SyncHandlers,
) {
  const pinned = useUiStore((x) => x.pinned)
  const notify = useNotificationFeed(panes, pinned)
  useStream(s, on ? wsId : null, {
    ...recovery,
    onTurn: (t) => {
      update(t)
      notify(t)
    },
  })
}
