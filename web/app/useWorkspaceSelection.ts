import { useCallback, useRef, useState } from 'react'
import type { AppConfig, WorkspaceApiPort } from '../domain/ports'
import { applySelectedWorkspace, createSelectionGate } from './workspaceSelection'

export function useWorkspaceSelection(
  api: WorkspaceApiPort,
  onSelected: (workspaceId: string) => void,
) {
  const gate = useRef(createSelectionGate())
  const [switching, setSwitching] = useState(false)

  const selectWorkspace = useCallback(
    async (workspaceId: string): Promise<AppConfig | null> => {
      if (!api.selectWorkspace) return null
      const token = gate.current.begin()
      setSwitching(true)
      try {
        const cfg = await api.selectWorkspace(workspaceId)
        const applied = applySelectedWorkspace(gate.current, token, cfg.workspaceId, onSelected)
        return applied ? cfg : null
      } finally {
        if (gate.current.isCurrent(token)) setSwitching(false)
      }
    },
    [api, onSelected],
  )

  return { selectWorkspace, switching }
}
