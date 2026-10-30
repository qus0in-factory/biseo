import type { UsageMetric } from '../domain/usage-types.js'
export function parseOllamaActivity(data: any): UsageMetric[] {
  const m: UsageMetric[] = []
  const activity = data?.activity
  if (activity && typeof activity === 'object' && typeof activity.cost === 'string' && /^\d+(?:\.\d+)?$/.test(activity.cost)) {
    m.push({ id: 'activity_last_4_weeks', label: 'Activity (4 weeks)', unit: 'currency', used: Number(activity.cost), limit: null, remaining: null, resetsAt: null })
  }
  return m
}
