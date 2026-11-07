import type { UsageProvider } from '../domain/usage'
import { CardContent } from '../components/ui/card'
import { UsagePanelBody } from './UsagePanelBody'
import { UsagePanelNotes } from './UsagePanelNotes'
import { UsageCheckedFooter } from './UsageCheckedFooter'
import { usageCheckedMode } from '../domain/usageCheckedAt'

export function UsagePanelFields({ provider, remaining, groupChecked = false }: {
  provider: UsageProvider; remaining?: boolean; groupChecked?: boolean
}) {
  const checked = groupChecked ? usageCheckedMode(provider) : null
  const footer = checked?.mode === 'footer' ? checked.at : null
  return (
    <CardContent className="grid gap-1">
      <UsagePanelNotes provider={provider} />
      <UsagePanelBody provider={provider} remaining={remaining} showChecked={!footer} />
      {footer && <UsageCheckedFooter at={footer} />}
    </CardContent>
  )
}
