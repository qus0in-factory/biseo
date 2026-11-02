import { Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useUiStore } from '../app/uiStore'
import r from '../resources.json'

export function HeaderMenuButton() {
  const toggleDrawer = useUiStore((s) => s.toggleDrawer)
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="md:hidden shrink-0"
      onClick={toggleDrawer}
      aria-label={r.openMenu}
      title={r.openMenu}
    >
      <Menu size={16} aria-hidden="true" />
    </Button>
  )
}
