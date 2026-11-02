import type { PaneSummary } from '../domain/timeline'
import { selectCollapsedPanes } from '../domain/collapsedPanes'
import { usePaneOrder } from '../app/usePaneOrder'
import { CollapsedPaneButton } from './CollapsedPaneButton'

type P = { panes: PaneSummary[]; selectedId: string | null; onSelect: (id: string) => void }

export function CollapsedPanePreview({ panes, selectedId, onSelect }: P) {
  const { panes: ordered } = usePaneOrder(panes)
  const shown = selectCollapsedPanes(ordered)
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {shown.map((pane) => (
        <li key={pane.paneId}>
          <CollapsedPaneButton pane={pane} selected={pane.paneId === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}
