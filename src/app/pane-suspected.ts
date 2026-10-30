import type { LimitScreen } from './limit-screen.js'
import type { Availability, PaneSummary } from '../domain/timeline.js'

export async function suspectedLimit(
  summary: Omit<PaneSummary, 'availability'>,
  availability: Availability,
  limits: LimitScreen | undefined,
): Promise<boolean> {
  if (summary.status !== 'blocked' || availability.state === 'limited' || !limits) return false
  return limits.classify(summary.paneId).catch(() => false)
}

export async function suspectedInput(
  summary: Omit<PaneSummary, 'availability'>,
  availability: Availability,
  inputs: LimitScreen | undefined,
): Promise<boolean> {
  if (summary.status !== 'blocked' || availability.state === 'limited' || !inputs) return false
  return inputs.classify(summary.paneId).catch(() => false)
}
