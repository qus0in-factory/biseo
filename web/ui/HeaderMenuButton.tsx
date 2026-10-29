import { Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useUiStore } from '../app/uiStore'

export function HeaderMenuButton() {
  const toggleDrawer = useUiStore((s) => s.toggleDrawer)
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="md:hidden shrink-0"
      onClick={toggleDrawer}
      aria-label="메뉴 열기"
    >
      <Menu size={20} aria-hidden="true" />
    </Button>
  )
}
