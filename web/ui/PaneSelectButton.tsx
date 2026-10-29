import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'

type P = { item: PaneSummary; active: boolean; onClick: () => void }

export function PaneSelectButton({ item, active, onClick }: P) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-16 min-h-16 w-full cursor-pointer flex-col justify-center gap-1 rounded-sm border border-border bg-surface p-2 px-3 text-left ${active ? 'outline-2 outline-offset-0 outline-ring' : ''}`}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <strong className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">{item.name}</strong>
        <PaneStatusBadge status={item.status} />
      </span>
      <span className="flex w-full items-center justify-start gap-1.5">
        <PaneMeta item={item} />
      </span>
    </button>
  )
}
