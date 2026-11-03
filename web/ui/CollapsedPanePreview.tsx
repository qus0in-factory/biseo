import type { PaneSummary } from '../domain/timeline'
import { usePaneOrder } from '../app/usePaneOrder'
import { CollapsedPaneButton } from './CollapsedPaneButton'

type P = { panes: PaneSummary[]; selectedId: string | null; onSelect: (id: string) => void }

export function CollapsedPanePreview({ panes, selectedId, onSelect }: P) {
  const { panes: ordered } = usePaneOrder(panes)
  return (
    <ul className="m-0 flex min-h-0 list-none flex-col gap-2 overflow-y-auto p-0">
      {ordered.map((pane) => (
        <li key={pane.paneId}>
          <CollapsedPaneButton pane={pane} selected={pane.paneId === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}
