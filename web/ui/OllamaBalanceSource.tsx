import type { UsageProvider } from '../domain/usage'
import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

export function OllamaBalanceSource({ provider }: { provider: UsageProvider }) {
  if (provider.provider !== 'ollama') return null
  const w = provider.windows[0]
  if (!w) return null
  return <span className="text-xs text-muted-foreground">
    {w.source && `${r.usageSource}: ${w.source}`}
    {w.checkedAt && ` · ${r.usageChecked}: ${formatZoned(w.checkedAt, 'Asia/Seoul')}`}
  </span>
}
