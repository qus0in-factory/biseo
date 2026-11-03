import type { UsageProvider } from '../domain/usage'
import r from '../resources.json'

export function OllamaBalanceSource({ provider }: { provider: UsageProvider }) {
  if (provider.provider !== 'ollama') return null
  const w = provider.windows[0]
  if (!w?.source?.endsWith('-stale')) return null
  return <span className="text-sm text-muted-foreground">
    {w.source && `${r.usageSource}: ${w.source}`}
  </span>
}
