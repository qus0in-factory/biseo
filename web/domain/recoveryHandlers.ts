import type { WorkspaceApiPort as Api, PaneSnapshot as S } from '../domain/ports'
import type { PaneSummary as P, TimelineItem as T } from '../domain/timeline'
import { syncPending } from '../domain/syncPending'

export interface SyncHandlers {
  onOpen: () => void
  onPanes: (snap: S) => void
  onError: () => void
}

export function createRecoveryHandlers(
  api: Api,
  reload: () => void,
  getItems: () => T[],
  getUpdate: () => (i: T) => void,
  setSnapshot: (p: P[]) => void,
  setOnline: (ok: boolean) => void,
  onDisconnect: () => void,
): SyncHandlers {
  return {
    onOpen: () => {
      setOnline(true)
      reload()
      syncPending(api, getItems(), getUpdate())
    },
    onPanes: (s) => {
      setOnline(true)
      if (s?.panes) setSnapshot(s.panes)
    },
    onError: () => {
      setOnline(false)
      onDisconnect()
    },
  }
}
