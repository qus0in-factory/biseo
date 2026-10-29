import { useEffect } from 'react'
import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import { useUiStore } from '../app/uiStore'

export function HistoryPage() {
  usePageTitle('히스토리 — Biseo')
  const setActiveTab = useUiStore((s) => s.setActiveTab)
  useEffect(() => {
    setActiveTab('history')
  }, [setActiveTab])

  return <WorkspaceSection on={true} />
}
