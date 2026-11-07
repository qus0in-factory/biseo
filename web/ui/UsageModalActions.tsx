import { UsageRefreshButton } from './UsageRefreshButton'
import { UsageSettingsButton } from './UsageSettingsButton'

export function UsageModalActions({ retry, loading, open, onToggle }: {
  retry: () => Promise<void>; loading: boolean; open: boolean; onToggle: () => void
}) {
  return <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
    <UsageRefreshButton retry={retry} loading={loading} />
    <UsageSettingsButton open={open} onToggle={onToggle} />
  </div>
}
