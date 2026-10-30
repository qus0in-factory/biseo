import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'
import { paneSelectClass } from './paneSelectClass'

type P = { item: PaneSummary; active: boolean; onClick: () => void }

export function PaneSelectButton({ item, active, onClick }: P) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={paneSelectClass(active)}
    >
      <span className="flex w-full min-w-0 items-center justify-between gap-2">
        <strong className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">{item.name}</strong>
        <PaneStatusBadge status={item.status} />
      </span>
      <span className="flex w-full min-w-0 items-center justify-start gap-1.5 overflow-hidden">
        <PaneMeta item={item} />
      </span>
    </button>
  )
}
