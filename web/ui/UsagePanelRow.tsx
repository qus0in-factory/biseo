import type { UsageProvider } from '../domain/usage'
import { Card, CardHeader } from '../components/ui/card'
import { UsagePanelFields } from './UsagePanelFields'
import { UsagePanelHeader } from './UsagePanelHeader'
import { isAuth, usageRowAria, usageStaleCls } from './usageRowAria.js'

export function UsagePanelRow({ provider, remaining, groupChecked = false }: {
  provider: UsageProvider; remaining?: boolean; groupChecked?: boolean
}) {
  const st = isAuth(provider)
  return (
    <Card size="sm" className={`min-w-0 self-start text-xs ${usageStaleCls(provider)}`} role={st ? 'region' : undefined} aria-label={usageRowAria(provider)}>
      <CardHeader>
        <UsagePanelHeader provider={provider} />
      </CardHeader>
      <UsagePanelFields provider={provider} remaining={remaining} groupChecked={groupChecked} />
    </Card>
  )
}
