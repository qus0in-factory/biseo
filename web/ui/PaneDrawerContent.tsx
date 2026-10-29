import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { UsageSection } from './UsageSection'

type P = Pick<DashboardProps, 'panes' | 'selectedId' | 'onSelect' | 'online'>

export function PaneDrawerContent({ panes, selectedId, onSelect, online }: P) {
  return (
    <>
      <UsageSection enabled={online} />
      <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
    </>
  )
}
