import { useState } from 'react'
import type { WorkspaceApiPort as Api, TimelineStreamPort as St } from '../domain/ports'
import { useWorkspaceRecovery } from './useWorkspaceRecovery'
import { useWorkspaceBase } from './useWorkspaceBase'
import { useWorkspaceStream } from './useWorkspaceStream'
import { useSyncRefs } from './useSyncRefs'
import { useUiStore } from './uiStore'

export function useWorkspaceController(a: Api, s: St, on: boolean) {
  const [online, setOnline] = useState(false)
  const sel = useUiStore((x) => x.selectedPaneId)
  const setSel = useUiStore((x) => x.setSelectedPaneId)
  const base = useWorkspaceBase(a, on, online, sel)
  const { getItems, getUpdate } = useSyncRefs(base.items, base.update)
  const { reload, setSnapshot, markDisconnected } = base
  const h = useWorkspaceRecovery(a, reload, getItems, getUpdate, setSnapshot, setOnline, markDisconnected, base.reloadTimeline)
  useWorkspaceStream(s, on, base.wsId, base.panes, base.update, h)

  return { ...base, sel, setSel, online }
}
