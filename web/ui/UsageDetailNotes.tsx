import type { UsageProvider } from '../domain/usage'
import { OllamaBalanceSource } from './OllamaBalanceSource'
import { UsageReasonNote } from './UsageReasonNote'

export function UsageDetailNotes({ provider }: { provider: UsageProvider }) {
  return (
    <>
      <OllamaBalanceSource provider={provider} />
      <UsageReasonNote reason={provider.reason} />
    </>
  )
}
