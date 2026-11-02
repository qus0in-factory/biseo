import { Star } from 'lucide-react'
import r from '../resources.json'

export function UsageBookmarkStar({ marked, onToggle }: { marked: boolean; onToggle: () => void }) {
  return (
    <span
      role="button"
      tabIndex={-1}
      aria-label={r.usageBookmarkAria}
      aria-pressed={marked}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="inline-flex items-center justify-center p-0.5"
    >
      <Star size={14} className={marked ? 'fill-current' : ''} />
    </span>
  )
}
