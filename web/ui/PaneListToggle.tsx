import { Button } from '../components/ui/button'
import { usePaneListStore } from '../app/paneListStore'
import r from '../resources.json'

export function PaneListToggle() {
  const { expanded, toggle } = usePaneListStore()
  const label = expanded ? r.collapsePaneList : r.expandPaneList
  return <Button variant="outline" size="icon" onClick={toggle}
    aria-label={label} title={label} aria-expanded={expanded}>
    {expanded ? '−' : '+'}
  </Button>
}
