import { useState, useMemo } from 'react'
import type { WorkspaceApiPort as Api, TimelineStreamPort as St } from '../domain/ports'
import { createRecoveryHandlers } from '../domain/recoveryHandlers'
import { useWorkspaceBase } from './useWorkspaceBase'
import { useStream } from './useStream'
import { useSyncRefs } from './useSyncRefs'

export function useWorkspaceController(a: Api, s: St, on: boolean) {
  const [online, setOnline] = useState(false)
  const [sel, setSel] = useState<string | null>(null)
  const base = useWorkspaceBase(a, on, online, sel)
  const { getItems, getUpdate } = useSyncRefs(base.items, base.update)

  const h = useMemo(
    () => createRecoveryHandlers(a, base.reload, getItems, getUpdate, base.setSnapshot, setOnline, base.markDisconnected),
    [a, base.reload, getItems, getUpdate, base.setSnapshot, base.markDisconnected],
  )

  useStream(s, on ? base.wsId : null, { ...h, onTurn: base.update })

  return { ...base, sel, setSel, online }
}
