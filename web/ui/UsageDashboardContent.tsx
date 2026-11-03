import type { UsageProvider } from '../domain/usage'
import { UsageEmptyProviders } from './UsageEmptyProviders'
import { UsageGrid } from './UsageGrid'
import { UsagePanelRow } from './UsagePanelRow'

export function UsageDashboardContent({ providers, remaining, onOpenSettings }: {
  providers: UsageProvider[]; remaining: boolean; onOpenSettings: () => void
}) {
  if (providers.length === 0) return <UsageEmptyProviders onOpen={onOpenSettings} />
  return (
    <UsageGrid>
      {providers.map((p) => <UsagePanelRow key={p.provider} provider={p} remaining={remaining} groupChecked />)}
    </UsageGrid>
  )
}
