import { forwardRef } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'
import { Star } from 'lucide-react'

type P = {
  item: PaneSummary
  active: boolean
  pinned?: boolean
  onTogglePin?: () => void
  onClick: () => void
}

export const PaneItem = forwardRef<HTMLLIElement, P>(function PaneItem(
  { item, active, pinned = false, onTogglePin, onClick },
  ref,
) {
  return (
    <li ref={ref} className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={pinned}
        aria-label={pinned ? '패널 고정 해제' : '패널 고정'}
        onClick={(event) => {
          event.stopPropagation()
          onTogglePin?.()
        }}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border border-border bg-white px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <Star
          className={`h-4 w-4 ${pinned ? 'fill-current text-primary' : ''}`}
          aria-hidden="true"
        />
        <span>{pinned ? '고정됨' : '고정'}</span>
      </button>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`flex h-16 min-h-16 w-full cursor-pointer flex-col justify-center gap-1 rounded-sm border border-border bg-white p-2 px-3 text-left ${active ? 'outline-2 outline-offset-0 outline-ring' : ''}`}
      >
        <span className="flex w-full items-center justify-between gap-2">
          <strong className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">{item.name}</strong>
          <PaneStatusBadge status={item.status} />
        </span>
        <span className="flex w-full items-center justify-start gap-1.5">
          <PaneMeta item={item} />
        </span>
      </button>
    </li>
  )
})
