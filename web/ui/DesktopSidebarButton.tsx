import type { Layers } from 'lucide-react'
import type { TabName } from '../domain/schemas/routeParams'

export function DesktopSidebarButton({
  tab,
  label,
  icon: I,
  active,
  onClick,
}: {
  tab: TabName
  label: string
  icon: typeof Layers
  active: boolean
  onClick: () => void
}) {
  const cls = active ? 'bg-card font-semibold' : 'text-muted-foreground'
  return (
    <button
      key={tab}
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] items-center gap-2 rounded px-2 text-sm ${cls}`}
    >
      <I size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
