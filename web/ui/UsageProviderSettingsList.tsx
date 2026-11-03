import type { UsageProvider } from '../domain/usage'
import { SortableList } from './sortable/SortableList'
import { SortableItem } from './sortable/SortableItem'
import { UsageProviderSettingRow } from './UsageProviderSettingRow'

type P = {
  providers: UsageProvider[]
  hidden: string[]
  onMove: (from: number, to: number) => void
  onToggle: (id: string) => void
}

export function UsageProviderSettingsList({ providers, hidden, onMove, onToggle }: P) {
  return (
    <SortableList ids={providers.map((p) => p.provider)} onReorder={onMove}>
      <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
        {providers.map((p) => (
          <SortableItem key={p.provider} id={p.provider}>
            {(s) => (
              <UsageProviderSettingRow
                provider={p.provider}
                hidden={hidden.includes(p.provider)}
                onToggle={() => onToggle(p.provider)}
                sortable={s}
              />
            )}
          </SortableItem>
        ))}
      </ul>
    </SortableList>
  )
}
