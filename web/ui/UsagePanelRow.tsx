import type { UsageProvider } from '../domain/usage'
import { UsageCacheNote } from './UsageCacheNote'
import { UsageReasonNote } from './UsageReasonNote'
import { UsagePanelBody } from './UsagePanelBody'
import r from '../resources.json'

export function UsagePanelRow({
  provider,
  remaining = true,
}: {
  provider: UsageProvider
  remaining?: boolean
}) {
  const s = (r as Record<string, string>)[`usage_${provider.state}`] ?? provider.state
  return (
    <div className="flex min-w-44 flex-col gap-1 rounded border px-2 py-2 text-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{provider.provider}</span>
        <span className={provider.state === 'limited' ? 'text-error' : 'text-muted-foreground'}>
          {s}
        </span>
      </div>
      <UsageCacheNote provider={provider} />
      <UsageReasonNote reason={provider.reason} />
      <UsagePanelBody provider={provider} remaining={remaining} />
    </div>
  )
}
