import { Star } from 'lucide-react'
import r from '../resources.json'

export function UsageBookmarkStar({ marked, onToggle }: { marked: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label={r.usageBookmarkAria} aria-pressed={marked}
      onClick={(e) => { e.stopPropagation(); onToggle() }}>
      <Star size={14} className={marked ? 'fill-current' : ''} />
    </button>
  )
}
