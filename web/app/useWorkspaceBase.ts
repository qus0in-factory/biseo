import { useCallback } from 'react'
import type { WorkspaceApiPort as Api } from '../domain/ports'
import { gateTarget } from '../domain/gateTarget'
import { useConfig } from './useConfig'
import { useWorkspaceSelection } from './useWorkspaceSelection'
import { usePanes } from './usePanes'
import { useTimeline } from './useTimeline'
import { usageApi } from '../infra/usageApi'
import { useUsageBackground } from './useUsageBackground'

export function useWorkspaceBase(
  a: Api,
  on: boolean,
  online: boolean,
  sel: string | null,
  setSel: (id: string | null) => void,
) {
  useUsageBackground(usageApi, on)
  const { wsId, applyWsId } = useConfig(a, on)
  const apply = useCallback((id: string) => {
    setSel(null)
    applyWsId(id)
  }, [setSel, applyWsId])
  const { selectWorkspace, switching } = useWorkspaceSelection(a, apply)
  const p = usePanes(a, wsId)
  const raw = p.panes.find((x) => x.paneId === sel)
  const target = gateTarget(raw, online)
  const t = useTimeline(a, wsId, target, switching)
  return { wsId, selectWorkspace, switching, ...p, ...t, target }
}
