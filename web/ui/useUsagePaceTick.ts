import { useContext } from 'react'
import { normalizeWarningWindow } from '../domain/usage-window-norm'
import { usageTimePercent } from '../domain/usage-time-percent'
import type { UsagePaceInput } from '../domain/usagePace'
import { UsagePaceDisplay } from './UsagePaceDisplay'

export type UsagePaceTickValue = { left: number; text: string }

export function useUsagePaceTick(window: string, pace?: UsagePaceInput | null): UsagePaceTickValue | null {
  const { settings } = useContext(UsagePaceDisplay)
  const kind = normalizeWarningWindow(window.split(':').pop()!)
  if (!pace || (kind !== 'w' && kind !== 'm') || !settings[kind]) return null
  const percent = usageTimePercent(pace.label, pace.startsAt, pace.resetsAt, pace.remaining)
  if (percent === null) return null
  const left = Math.max(0, Math.min(100, percent))
  return { left, text: `${left}%` }
}
