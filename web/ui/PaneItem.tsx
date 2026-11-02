import { forwardRef } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { PaneSelectButton } from './PaneSelectButton'
import type { SortableState } from './sortable/SortableItem'
import r from '../resources.json'

type P = {
  item: PaneSummary
  active: boolean
  onClick: () => void
  sortable?: SortableState
}

export const PaneItem = forwardRef<HTMLLIElement, P>(function PaneItem(
  { item, active, onClick, sortable },
  ref,
) {
  const drag = sortable
    ? { ...sortable.attributes, role: 'listitem' as const, 'aria-label': `${item.name} ${r.paneReorderHint}` }
    : {}
  const setRef = (element: HTMLLIElement | null) => {
    if (typeof ref === 'function') ref(element)
    else if (ref) ref.current = element
    sortable?.ref(element)
  }
  return (
    <li
      ref={setRef}
      style={sortable?.style}
      {...drag}
      {...sortable?.listeners}
      className="flex touch-manipulation items-center gap-2"
    >
      <PaneSelectButton item={item} active={active} onClick={onClick} />
    </li>
  )
})
