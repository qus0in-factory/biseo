import { History } from 'lucide-react'
import r from '../resources.json'

export function TimelineHeader() {
  return (
    <h2 className="mb-2 flex items-center gap-2 border-b border-border pb-2 font-bold">
      <History size={16} aria-hidden="true" />
      {r.timelineTitle}
    </h2>
  )
}
