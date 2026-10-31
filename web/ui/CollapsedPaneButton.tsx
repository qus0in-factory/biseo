import { Button } from '../components/ui/button'
import type { PaneSummary } from '../domain/timeline'
type P = {pane: PaneSummary; selected: boolean; onSelect: (id: string) => void}
export function CollapsedPaneButton({pane, selected, onSelect}: P) {
 return <Button variant="outline" size="icon" title={pane.name} aria-label={pane.name}
  aria-pressed={selected} onClick={() => onSelect(pane.paneId)}
  className={`overflow-hidden ${selected ? 'bg-muted font-semibold ring-1 ring-ring' : ''}`}>
  {Array.from(pane.name.trim())[0]?.toLocaleUpperCase() ?? '·'}
 </Button>
}
