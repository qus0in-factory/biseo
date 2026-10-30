import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage'
import { UsageWindowTime } from './UsageWindowTime'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageWindowRow({ provider, value, remaining = true }: { provider: string; value: UsageWindow; remaining?: boolean }) {
  const shown = remaining && value.usedPercent !== null ? Math.max(0, 100 - value.usedPercent) : value.usedPercent
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{usageWindowName(provider, value.window, res)}</span>
        <span className="font-mono text-xs">{usagePercentText(shown, res.usageUnknownPercent)}</span>
      </div>
      <UsageWindowTime value={value} />
    </div>
  )
}
