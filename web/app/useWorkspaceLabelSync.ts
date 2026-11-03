import { useEffect } from 'react'
import type { WorkspaceSummary } from '../domain/ports'
import { useUiStore } from './uiStore'

export function useWorkspaceLabelSync(current: string | null, workspaces: WorkspaceSummary[]) {
  const setWorkspaceLabel = useUiStore((s) => s.setWorkspaceLabel)
  useEffect(() => {
    if (!current) { setWorkspaceLabel(null); return }
    setWorkspaceLabel(null)
    const found = workspaces.find((w) => (w.workspaceId ?? w.id ?? '') === current)
    setWorkspaceLabel(found?.label ?? null)
  }, [current, workspaces, setWorkspaceLabel])
}