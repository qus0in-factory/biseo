import { useMemo } from 'react'
import type { WorkspaceApiPort as Api } from '../domain/ports'
import { createRecoveryHandlers } from '../domain/recoveryHandlers'
import { notifyStreamOpen } from '../infra/streamOpenEvent'

export function useWorkspaceRecovery(
  a: Api,
  reload: () => void,
  getItems: () => any,
  getUpdate: () => any,
  setSnapshot: (s: any) => void,
  setOnline: (o: boolean) => void,
  markDisconnected: () => void,
  reloadTimeline?: () => void,
) {
  return useMemo(
    () => createRecoveryHandlers(a, reload, getItems, getUpdate, setSnapshot, setOnline, markDisconnected, reloadTimeline, notifyStreamOpen),
    [a, reload, getItems, getUpdate, setSnapshot, setOnline, markDisconnected, reloadTimeline],
  )
}
