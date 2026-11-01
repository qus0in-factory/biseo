import type { UsageWindow } from '../domain/usage'
import { UsageWindowTime } from './UsageWindowTime'
import { UsageWindowValue } from './UsageWindowValue'
import r from '../resources.json'

export function UsageWindowRow({ provider, value, remaining = true }: { provider: string; value: UsageWindow; remaining?: boolean }) {
  const limited = value.limitReached || (value.usedPercent !== null && value.usedPercent >= 100)
  return (
    <div className={`flex flex-col gap-0.5 border-t border-border/60 pt-1 ${limited ? 'text-error [&_.text-muted-foreground]:text-error' : ''}`}>
      {limited && <span className="sr-only">{r.usage_limited}</span>}
      <UsageWindowValue provider={provider} value={value} remaining={remaining} />
      <UsageWindowTime value={value} />
    </div>
  )
}
