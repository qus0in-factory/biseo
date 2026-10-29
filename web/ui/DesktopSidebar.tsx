import { useUiStore } from '../app/uiStore'
import type { TabName } from '../domain/schemas/routeParams'
import { Layers, MessageSquare, History } from 'lucide-react'

const navs: [TabName, string, typeof Layers][] = [
  ['panels', '패널', Layers],
  ['chat', '채팅', MessageSquare],
  ['history', '히스토리', History],
]

export function DesktopSidebar() {
  const { activeTab, setActiveTab } = useUiStore()
  return (
    <aside className="hidden md:flex w-36 shrink-0 flex-col border-r border-border pr-2">
      <nav className="flex flex-col gap-1">
        {navs.map(([t, l, I]) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`flex min-h-[44px] items-center gap-2 rounded px-2 text-sm ${
              activeTab === t ? 'bg-card font-semibold' : 'text-muted-foreground'
            }`}
          ><I size={16} aria-hidden="true" /><span>{l}</span></button>
        ))}
      </nav>
    </aside>
  )
}
