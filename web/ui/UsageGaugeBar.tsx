import r from '../resources.json'
import type { UsagePaceTickValue } from './useUsagePaceTick'

export function UsageGaugeBar({ value, color, label, tick }: {
  value: number; color: string; label: string; tick: UsagePaceTickValue | null
}) {
  return (
    <div className="relative w-full min-w-0 pt-1">
      {tick && <span aria-hidden="true" className="absolute top-0 h-1 w-0.5 -translate-x-1/2 rounded-full bg-foreground" style={{ left: `${tick.left}%` }} />}
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={tick ? `${Math.round(value)}% · ${r.usagePace} ${tick.text}` : undefined}
        className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
