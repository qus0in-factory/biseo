import { GripVertical } from 'lucide-react'
import type { SortableState } from './sortable/SortableItem'
import r from '../resources.json'

export function UsageProviderDrag({ provider, sortable }: { provider: string; sortable: SortableState }) {
  return (
    <button
      type="button"
      {...sortable.attributes}
      {...sortable.listeners}
      aria-label={`${provider} ${r.usageReorderHint}`}
      className="flex min-h-11 min-w-11 select-none touch-none items-center justify-center text-muted-foreground"
    >
      <GripVertical size={16} aria-hidden="true" />
    </button>
  )
}
