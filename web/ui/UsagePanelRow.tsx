import type { UsageProvider } from '../domain/usage'
import { UsageCacheNote } from './UsageCacheNote'
import { UsagePanelBody } from './UsagePanelBody'
import { UsagePanelHeader } from './UsagePanelHeader'
import { UsageAuthNotice } from './UsageAuthNotice'
import { UsageDetailNotes } from './UsageDetailNotes'
import { isAuth, usageRowAria, usageStaleCls } from './usageRowAria.js'

export function UsagePanelRow({ provider, remaining = true }: { provider: UsageProvider; remaining?: boolean }) {
  const st = isAuth(provider)
  return (
    <div className={`flex min-w-44 flex-col gap-1 rounded border p-2 text-xs ${usageStaleCls(provider)}`} role={st ? 'region' : undefined} aria-label={usageRowAria(provider)}>
      <UsagePanelHeader provider={provider} />
      {st ? <UsageAuthNotice provider={provider} /> : <>
        <UsageCacheNote provider={provider} />
        <UsageDetailNotes provider={provider} />
      </>}
      <UsagePanelBody provider={provider} remaining={remaining} />
    </div>
  )
}
