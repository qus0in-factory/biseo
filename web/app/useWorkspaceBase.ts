import type { WorkspaceApiPort as Api, TimelineStreamPort as St } from '../domain/ports'
import type { PaneSummary } from '../domain/timeline'
import { gateTarget } from '../domain/gateTarget'
import { useConfig } from './useConfig'
import { usePanes } from './usePanes'
import { useTimeline } from './useTimeline'
import { usageApi } from '../infra/usageApi'
import { useUsageBackground } from './useUsageBackground'

export function useWorkspaceBase(a: Api, on: boolean, online: boolean, sel: string | null) {
  useUsageBackground(usageApi, on)
  const { wsId } = useConfig(a, on)
  const p = usePanes(a, wsId)
  const raw = p.panes.find((x) => x.paneId === sel)
  const target = gateTarget(raw, online)
  const t = useTimeline(a, wsId, target)
  return { wsId, ...p, ...t, target }
}
