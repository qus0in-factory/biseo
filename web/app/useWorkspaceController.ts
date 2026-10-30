import { useState } from 'react'
import type { WorkspaceApiPort as Api, TimelineStreamPort as St } from '../domain/ports'
import { useWorkspaceRecovery } from './useWorkspaceRecovery'
import { useWorkspaceBase } from './useWorkspaceBase'
import { useStream } from './useStream'
import { useSyncRefs } from './useSyncRefs'
import { useUiStore } from './uiStore'

export function useWorkspaceController(a: Api, s: St, on: boolean) {
  const [online, setOnline] = useState(false)
  const sel = useUiStore((x) => x.selectedPaneId)
  const setSel = useUiStore((x) => x.setSelectedPaneId)
  const base = useWorkspaceBase(a, on, online, sel)
  const { getItems, getUpdate } = useSyncRefs(base.items, base.update)
  const { reload, setSnapshot, markDisconnected, reloadTimeline } = base

  const h = useWorkspaceRecovery(a, reload, getItems, getUpdate, setSnapshot, setOnline, markDisconnected, reloadTimeline)
  useStream(s, on ? base.wsId : null, { ...h, onTurn: base.update })

  return { ...base, sel, setSel, online }
}
