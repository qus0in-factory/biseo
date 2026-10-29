import { Sheet, SheetContent } from '../components/ui/sheet'
import { useUiStore } from '../app/uiStore'
import { MobileDrawerNav } from './MobileDrawerNav'

export function MobileDrawer({ online = true }: { online?: boolean }) {
  const { drawerOpen, setDrawerOpen, setActiveTab } = useUiStore()

  const nav = (t: Parameters<typeof setActiveTab>[0]) => {
    setActiveTab(t)
    setDrawerOpen(false)
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
