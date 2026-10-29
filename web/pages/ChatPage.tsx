import { useEffect } from 'react'
import { useParams } from 'react-router'
import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import { useUiStore } from '../app/uiStore'
import { parseRouteParams } from '../domain/schemas/routeParams'

export function ChatPage() {
  usePageTitle('채팅 — Biseo')
  const params = useParams()
  const { paneId } = parseRouteParams(params)
  const setSelectedPaneId = useUiStore((s) => s.setSelectedPaneId)

  useEffect(() => {
    if (paneId) setSelectedPaneId(paneId)
  }, [paneId, setSelectedPaneId])

  return <WorkspaceSection on={true} />
}
