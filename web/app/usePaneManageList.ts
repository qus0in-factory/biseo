import { useEffect, useState } from 'react'
import { workspaceApi } from '../infra/workspaceApi'
import { listState } from '../domain/asyncListState'
import type { PaneSummary } from '../domain/timeline'

export function usePaneManageList(workspaceId?: string) {
 const [ws, setWs] = useState(workspaceId ?? '')
 const [panes, setPanes] = useState<PaneSummary[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)
 const load = async () => {
  setLoading(true); setError(null)
  try {
   const config = await workspaceApi.getConfig()
   setWs(config.workspaceId)
   const list = await workspaceApi.getPanes(config.workspaceId)
   setPanes(list)
   return list
  } catch (error) { setError('connection_unavailable'); throw error }
  finally { setLoading(false) }
 }
 useEffect(() => { void load().catch(() => {}) }, [])
 return { ws, panes, state: listState(panes, loading, error), load }
}
