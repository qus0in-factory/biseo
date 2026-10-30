import type { AsyncState } from '../domain/asyncState'
import type { UsageProvider } from '../domain/usage'
import { AsyncList } from './AsyncList'
import { ListSkeleton } from './ListSkeleton'
import { UsageTabs } from './UsageTabs'
import r from '../resources.json'

type P = {
  state: AsyncState<UsageProvider[]>
  retry: () => void
  bookmarks: string[]
  onToggleBookmark: (id: string) => void
  remaining: boolean
  tab: string
  onTabChange: (v: string) => void
}

export function UsageTabsAsync({ state, retry, ...tabs }: P) {
  return (
    <AsyncList
      state={state}
      skeleton={<ListSkeleton rows={2} />}
      empty={<p className="text-sm text-muted-foreground">{r.usageEmpty}</p>}
      errorText={r.usageError}
      onRetry={retry}
    >
      {(providers) => <UsageTabs providers={providers} {...tabs} />}
    </AsyncList>
  )
}
