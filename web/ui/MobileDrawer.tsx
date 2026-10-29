import { useNavigate } from 'react-router'
import { Sheet, SheetContent } from '../components/ui/sheet'
import { useUiStore } from '../app/uiStore'
import { MobileDrawerNav } from './MobileDrawerNav'
import { tabToPath } from '../lib/tabToPath'
import type { TabName } from '../domain/schemas/routeParams'

export function MobileDrawer({ online = true }: { online?: boolean }) {
  const navigate = useNavigate()
  const { drawerOpen, setDrawerOpen, setActiveTab, selectedPaneId } = useUiStore()

  const nav = (t: TabName) => {
    setActiveTab(t)
    setDrawerOpen(false)
    navigate(tabToPath(t, selectedPaneId))
  }

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent title="Biseo 메뉴">
        <MobileDrawerNav onNav={nav} />
        <div className="mt-auto pt-4 border-t border-border text-xs text-muted-foreground">
          상태: {online ? '연결됨' : '연결 끊김'}
        </div>
      </SheetContent>
    </Sheet>
  )
}
