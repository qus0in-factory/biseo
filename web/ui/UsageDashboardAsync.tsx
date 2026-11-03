import type { AsyncState } from '../domain/asyncState'
import type { UsageProvider } from '../domain/usage'
import { AsyncList } from './AsyncList'
import { UsageDashboard } from './UsageDashboard'
import r from '../resources.json'

type P = {
  state: AsyncState<UsageProvider[]>
  retry: () => void
  remaining: boolean
  settingsOpen: boolean
  onSettingsOpenChange: (open: boolean) => void
}

export function UsageDashboardAsync({ state, retry, ...props }: P) {
  return (
    <AsyncList
      state={state}
      rows={2}
      empty={<p className="text-sm text-muted-foreground">{r.usageEmpty}</p>}
      errorText={r.usageError}
      onRetry={retry}
    >
      {(providers) => <UsageDashboard providers={providers} {...props} />}
    </AsyncList>
  )
}
