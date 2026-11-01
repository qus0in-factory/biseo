import { PanelLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import r from '../resources.json'

export function PaneDrawerToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const label = open ? r.collapseDrawer : r.expandDrawer
  return (
    <Button variant="outline" size="icon"
      type="button"
      aria-label={label}
      aria-expanded={open}
      title={label}
      onClick={onToggle}
    >
      <PanelLeft size={17} aria-hidden="true" />
    </Button>
  )
}
