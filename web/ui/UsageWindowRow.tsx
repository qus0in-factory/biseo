import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage'
import { UsageWindowTime } from './UsageWindowTime'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageWindowRow({ value }: { value: UsageWindow }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{usageWindowName(value.window, res)}</span>
        <span className="font-mono text-xs">{usagePercentText(value.usedPercent, res.usageUnknownPercent)}</span>
      </div>
      <UsageWindowTime value={value} />
    </div>
  )
}
