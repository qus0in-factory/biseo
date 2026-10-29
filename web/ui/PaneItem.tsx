import { forwardRef } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { PanePinButton } from './PanePinButton'
import { PaneSelectButton } from './PaneSelectButton'

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
      <PanePinButton pinned={pinned} onTogglePin={onTogglePin} />
      <PaneSelectButton item={item} active={active} onClick={onClick} />
    </li>
  )
})
