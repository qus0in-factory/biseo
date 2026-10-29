import { useNavigate } from 'react-router'
import { useUiStore } from '../app/uiStore'
import { tabToPath } from '../lib/tabToPath'
import { sidebarNavs } from './sidebarNavs'
import { DesktopSidebarButton } from './DesktopSidebarButton'

export function DesktopSidebar() {
  const navigate = useNavigate()
  const { activeTab, setActiveTab, selectedPaneId } = useUiStore()

  const nav = (t: Parameters<typeof setActiveTab>[0]) => {
    setActiveTab(t)
    navigate(tabToPath(t, selectedPaneId))
  }

  return (
    <aside className="hidden md:flex w-36 shrink-0 flex-col border-r border-border pr-2">
      <nav className="flex flex-col gap-1">
        {sidebarNavs.map(([t, l, I]) => (
          <DesktopSidebarButton
            key={t}
            tab={t}
            label={l}
            icon={I}
            active={activeTab === t}
            onClick={() => nav(t)}
          />
        ))}
      </nav>
    </aside>
  )
}
