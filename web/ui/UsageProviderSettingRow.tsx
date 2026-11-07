import { UsageProviderDrag } from './UsageProviderDrag'
import { UsageProviderName } from './UsageProviderName'
import { UsageProviderVisibilityToggle } from './UsageProviderVisibilityToggle'
import type { SortableState } from './sortable/SortableItem'

type P = {
  provider: string
  hidden: boolean
  onToggle: () => void
  sortable: SortableState
}

export function UsageProviderSettingRow({ provider, hidden, onToggle, sortable }: P) {
  return (
    <li ref={sortable.ref} style={sortable.style} className="flex items-center gap-1">
      <UsageProviderDrag provider={provider} sortable={sortable} />
      <UsageProviderName provider={provider} />
      <UsageProviderVisibilityToggle provider={provider} hidden={hidden} onToggle={onToggle} />
    </li>
  )
}
