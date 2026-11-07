import type { UsageProvider } from '../domain/usage'
import { needsUsageNotice } from '../domain/usage-failure-state'
import { UsageAuthNotice } from './UsageAuthNotice'
import { UsageCacheNote } from './UsageCacheNote'
import { UsageDetailNotes } from './UsageDetailNotes'
import { compactUsageNote } from '../domain/usage-note'
import { OllamaBalanceSource } from './OllamaBalanceSource'

export function UsagePanelNotes({ provider }: { provider: UsageProvider }) {
  if (compactUsageNote(provider)) return <OllamaBalanceSource provider={provider} />
  return needsUsageNotice(provider) ? <UsageAuthNotice provider={provider} /> : <>
    <UsageCacheNote provider={provider} />
    <UsageDetailNotes provider={provider} />
  </>
}
