import type { PaneSummary } from '../domain/timeline'
import { partitionPanes } from '../domain/pinnedPanes'
import { selectCollapsedPanes } from '../domain/collapsedPanes'
import { useUiStore } from '../app/uiStore'
import { usePaneListStore } from '../app/paneListStore'
import { CollapsedPaneButton } from './CollapsedPaneButton'

type P = { panes: PaneSummary[]; selectedId: string | null; onSelect: (id: string) => void }

export function CollapsedPanePreview({ panes, selectedId, onSelect }: P) {
  const expanded = usePaneListStore(state => state.expanded)
  const pinned = useUiStore(s => s.pinned)
  const { pinned: pinnedPanes, rest } = partitionPanes(panes, pinned)
  const shown = selectCollapsedPanes([...pinnedPanes, ...rest], expanded)
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {shown.map((pane) => (
        <li key={pane.paneId}>
          <CollapsedPaneButton pane={pane} selected={pane.paneId === selectedId} onSelect={onSelect}/>
        </li>
      ))}
    </ul>
  )
}
