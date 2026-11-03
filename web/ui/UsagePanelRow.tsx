import type { UsageProvider } from '../domain/usage'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { UsageCacheNote } from './UsageCacheNote'
import { UsagePanelBody } from './UsagePanelBody'
import { UsagePanelHeader } from './UsagePanelHeader'
import { UsageAuthNotice } from './UsageAuthNotice'
import { UsageDetailNotes } from './UsageDetailNotes'
import { isAuth, usageRowAria, usageStaleCls } from './usageRowAria.js'

export function UsagePanelRow({ provider, remaining, summary }: { provider: UsageProvider; remaining?: boolean; summary?: boolean }) {
  const st = isAuth(provider)
  return (
    <Card size="sm" className={`min-w-0 self-start text-xs ${usageStaleCls(provider)}`} role={st ? 'region' : undefined} aria-label={usageRowAria(provider)}>
      <CardHeader>
        <UsagePanelHeader provider={provider} />
      </CardHeader>
      <CardContent className="grid gap-1">
        {st ? <UsageAuthNotice provider={provider} /> : <>
          <UsageCacheNote provider={provider} />
          <UsageDetailNotes provider={provider} />
        </>}
        <UsagePanelBody provider={provider} remaining={remaining} summary={summary} />
      </CardContent>
    </Card>
  )
}
