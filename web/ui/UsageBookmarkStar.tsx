import { Star } from 'lucide-react'
import r from '../resources.json'
import { stopHintEvent } from './hintPopoverProps'

export function UsageBookmarkStar({ marked, onToggle }: { marked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={r.usageBookmarkAria}
      aria-pressed={marked}
      onPointerDown={stopHintEvent}
      onMouseDown={stopHintEvent}
      onTouchStart={stopHintEvent}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      <Star size={14} className={marked ? 'fill-current' : ''} />
    </button>
  )
}
