import type { UsageProvider } from '../domain/usage'
import { CardContent } from '../components/ui/card'
import { UsageCacheNote } from './UsageCacheNote'
import { UsagePanelBody } from './UsagePanelBody'
import { UsageAuthNotice } from './UsageAuthNotice'
import { UsageCheckedFooter } from './UsageCheckedFooter'
import { UsageDetailNotes } from './UsageDetailNotes'
import { usageCheckedMode } from '../domain/usageCheckedAt'
import { isAuth } from './usageRowAria.js'

export function UsagePanelFields({ provider, remaining, groupChecked = false }: {
  provider: UsageProvider; remaining?: boolean; groupChecked?: boolean
}) {
  const st = isAuth(provider)
  const checked = groupChecked ? usageCheckedMode(provider) : null
  const footer = checked?.mode === 'footer' ? checked.at : null
  return (
    <CardContent className="grid gap-1">
      {st ? <UsageAuthNotice provider={provider} /> : <>
        <UsageCacheNote provider={provider} />
        <UsageDetailNotes provider={provider} />
      </>}
      <UsagePanelBody provider={provider} remaining={remaining} showChecked={!footer} />
      {footer && <UsageCheckedFooter at={footer} />}
    </CardContent>
  )
}
