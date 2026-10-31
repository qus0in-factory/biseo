import type { PaneSummary } from '../domain/timeline'
import { partitionPanes } from '../domain/pinnedPanes'
import { selectCollapsedPanes } from '../domain/collapsedPanes'
import { useUiStore } from '../app/uiStore'

type P = { panes: PaneSummary[]; count: number; selectedId: string | null; onSelect: (id: string) => void }

export function CollapsedPanePreview({ panes, count, selectedId, onSelect }: P) {
  const pinned = useUiStore((s) => s.pinned)
  const { pinned: pinnedPanes, rest } = partitionPanes(panes, pinned)
  const shown = selectCollapsedPanes([...pinnedPanes, ...rest], count)
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {shown.map((pane) => (
        <li key={pane.paneId} className="text-xs text-muted-foreground">
          <button type="button" className={pane.paneId === selectedId ? 'font-semibold' : ''} onClick={() => onSelect(pane.paneId)}>{pane.paneId}</button>
        </li>
      ))}
    </ul>
  )
}
