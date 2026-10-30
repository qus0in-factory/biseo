import type { PaneSummary } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import { PanesView } from './PanesView'

type P = {
  panes: PaneSummary[]
  state?: AsyncState<PaneSummary[]>
  onRetry?: () => void
  selectedId: string | null
  onSelect: (paneId: string) => void
}

export function PaneDrawerContent({ panes, state, onRetry, selectedId, onSelect }: P) {
  return (
    <div className="flex flex-col gap-2">
      <PanesView panes={panes} state={state} onRetry={onRetry} selectedId={selectedId} onSelect={onSelect} />
    </div>
  )
}
