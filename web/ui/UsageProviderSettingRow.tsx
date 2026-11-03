import { GripVertical } from 'lucide-react'
import { ModelIcon } from './ModelIcon'
import { UsageProviderVisibilityToggle } from './UsageProviderVisibilityToggle'
import { usageProviderFamily } from '../domain/usage-provider-family'
import type { SortableState } from './sortable/SortableItem'
import r from '../resources.json'

type P = {
  provider: string
  hidden: boolean
  onToggle: () => void
  sortable: SortableState
}

export function UsageProviderSettingRow({ provider, hidden, onToggle, sortable }: P) {
  return (
    <li ref={sortable.ref} style={sortable.style} className="flex items-center gap-1">
      <button
        type="button"
        {...sortable.attributes}
        {...sortable.listeners}
        aria-label={`${provider} ${r.usageReorderHint}`}
        className="flex min-h-11 min-w-11 select-none touch-none items-center justify-center text-muted-foreground"
      >
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <ModelIcon family={usageProviderFamily(provider)} />
      <span className="min-w-0 flex-1 truncate text-sm" title={provider}>{provider}</span>
      <UsageProviderVisibilityToggle provider={provider} hidden={hidden} onToggle={onToggle} />
    </li>
  )
}
