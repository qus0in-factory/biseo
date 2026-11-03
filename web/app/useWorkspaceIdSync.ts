import { useEffect } from 'react'
import { useUiStore } from './uiStore'

export function useWorkspaceIdSync(wsId: string | null) {
  const setWorkspaceId = useUiStore((s) => s.setWorkspaceId)
  useEffect(() => {
    setWorkspaceId(wsId)
  }, [wsId, setWorkspaceId])
}