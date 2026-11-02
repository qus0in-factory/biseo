import { AlertTriangle, CircleCheck, HelpCircle } from 'lucide-react'
import type { UsageProvider } from '../domain/usage'
import { usageHeaderStatus } from '../domain/usage-header-status.js'
import { UsageHistoryButton } from './UsageHistoryButton'
import { HintPopover } from './HintPopover'
import r from '../resources.json'

const icons = { alert: AlertTriangle, check: CircleCheck, help: HelpCircle }

export function UsagePanelHeader({ provider }: { provider: UsageProvider }) {
  const { title, icon, cls } = usageHeaderStatus(provider, r as Record<string, string>)
  const Icon = icons[icon]
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium">{provider.provider}</span>
      <div className="flex items-center">
        <HintPopover label={title} className={cls}>
          <Icon size={14} aria-hidden="true" />
        </HintPopover>
        <UsageHistoryButton provider={provider.provider} />
      </div>
    </div>
  )
}
