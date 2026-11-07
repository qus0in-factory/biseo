import { UsageRefreshButton } from './UsageRefreshButton'
import { UsageSettingsButton } from './UsageSettingsButton'

export function UsageModalActions({ retry, loading, open, onToggle }: {
  retry: () => Promise<void>; loading: boolean; open: boolean; onToggle: () => void
}) {
  return <>
    <UsageRefreshButton retry={retry} loading={loading} />
    <UsageSettingsButton open={open} onToggle={onToggle} />
  </>
}
