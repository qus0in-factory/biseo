import type { UsageProvider } from '../domain/usage'
import { UsageCacheNote } from './UsageCacheNote'
import { UsageReasonNote } from './UsageReasonNote'
import { UsagePanelBody } from './UsagePanelBody'
import { OllamaBalanceSource } from './OllamaBalanceSource'
import { UsagePanelHeader } from './UsagePanelHeader'

export function UsagePanelRow({
  provider,
  remaining = true,
}: {
  provider: UsageProvider
  remaining?: boolean
}) {
  return (
    <div className="flex min-w-44 flex-col gap-1 rounded border px-2 py-2 text-xs">
      <UsagePanelHeader provider={provider} />
      <UsageCacheNote provider={provider} />
      <OllamaBalanceSource provider={provider} />
      <UsageReasonNote reason={provider.reason} />
      <UsagePanelBody provider={provider} remaining={remaining} />
    </div>
  )
}
