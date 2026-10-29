import { useEffect } from 'react'
import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import { useUiStore } from '../app/uiStore'

export function PanesPage() {
  usePageTitle('패널 — Biseo')
  const setActiveTab = useUiStore((s) => s.setActiveTab)
  useEffect(() => {
    setActiveTab('panels')
  }, [setActiveTab])

  return <WorkspaceSection on={true} />
}
