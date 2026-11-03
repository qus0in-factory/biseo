import { AlertTriangle, CircleCheck, HelpCircle } from 'lucide-react'
import type { UsageProvider } from '../domain/usage'
import { usageHeaderStatus } from '../domain/usage-header-status.js'
import { HintPopover } from './HintPopover'
import { UsageLimitCount } from './UsageLimitCount'
import { UsageProviderName } from './UsageProviderName'
import r from '../resources.json'

const icons = { alert: AlertTriangle, check: CircleCheck, help: HelpCircle }

export function UsagePanelHeader({ provider }: { provider: UsageProvider }) {
  const { title, icon, cls } = usageHeaderStatus(provider, r as Record<string, string>)
  const Icon = icons[icon]
  return (
    <div className="flex items-center justify-between gap-2">
      <UsageProviderName provider={provider.provider} />
      <UsageLimitCount provider={provider} />
      <div className="flex shrink-0 items-center gap-1 [&_button:hover]:bg-muted">
        <HintPopover label={title} className={cls}>
          <Icon size={14} aria-hidden="true" />
        </HintPopover>
      </div>
    </div>
  )
}
