import { AlertTriangle, CircleCheck } from 'lucide-react'
import type { UsageProvider } from '../domain/usage'
import { usageLimitCount } from '../domain/usage-limit-count'
import r from '../resources.json'

export function UsageLimitCount({ provider }: { provider: UsageProvider }) {
  const count = usageLimitCount(provider)
  if (!count) return null
  const text = `${r.usage_available} ${count.available} · ${r.usage_limited} ${count.limited}`
  return (
    <span className="flex min-w-0 items-center gap-1 text-xs tabular-nums text-muted-foreground" title={text}>
      <CircleCheck size={12} className="shrink-0 text-success" aria-hidden="true" />
      <span className="truncate">{r.usage_available} {count.available}</span>
      <span aria-hidden="true">·</span>
      <AlertTriangle size={12} className="shrink-0 text-error" aria-hidden="true" />
      <span className="truncate">{r.usage_limited} {count.limited}</span>
    </span>
  )
}
