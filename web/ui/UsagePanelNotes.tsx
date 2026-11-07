import type { UsageProvider } from '../domain/usage'
import { needsUsageNotice } from '../domain/usage-failure-state'
import { UsageAuthNotice } from './UsageAuthNotice'
import { UsageCacheNote } from './UsageCacheNote'
import { UsageDetailNotes } from './UsageDetailNotes'

export function UsagePanelNotes({ provider }: { provider: UsageProvider }) {
  return needsUsageNotice(provider) ? <UsageAuthNotice provider={provider} /> : <>
    <UsageCacheNote provider={provider} />
    <UsageDetailNotes provider={provider} />
  </>
}
