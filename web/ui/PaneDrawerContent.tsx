import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'

type P = Pick<DashboardProps, 'panes' | 'selectedId' | 'onSelect'>

export function PaneDrawerContent({ panes, selectedId, onSelect }: P) {
  return (
    <div className="flex flex-col gap-2">
      <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
    </div>
  )
}
