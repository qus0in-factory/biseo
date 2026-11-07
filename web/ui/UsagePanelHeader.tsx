import type { UsageProvider } from '../domain/usage'
import { UsageHeaderStatus } from './UsageHeaderStatus'
import { UsageLimitCount } from './UsageLimitCount'
import { UsageProviderName } from './UsageProviderName'
import { usageLimitCount } from '../domain/usage-limit-count'
import { UsageNoteHint } from './UsageNoteHint'

export function UsagePanelHeader({ provider }: { provider: UsageProvider }) {
  const showStatus = !usageLimitCount(provider)
  return (
    <div className="relative flex items-center justify-between gap-2 pr-6">
      <UsageProviderName provider={provider.provider} />
      <UsageLimitCount provider={provider} />
      {showStatus && <UsageHeaderStatus provider={provider} />}
      <UsageNoteHint provider={provider} />
    </div>
  )
}
