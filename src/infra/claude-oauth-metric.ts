import type { UsageMetric } from '../domain/usage-types.js'

export function makeClaudeMetric(key: string, obj: any): UsageMetric {
  const u = typeof obj?.utilization === 'number' ? obj.utilization : null
  const resetsAt = typeof obj?.resets_at === 'string' ? obj.resets_at : null
  const label = formatClaudeLabel(key)
  const remaining = u !== null ? Math.max(0, 100 - u) : null
  return { id: key, label, unit: 'percent', used: u, limit: 100, remaining, resetsAt }
}

function formatClaudeLabel(k: string): string {
  const map: Record<string, string> = {
    five_hour: '5-Hour Limit',
    seven_day: '7-Day Limit',
    seven_day_opus: '7-Day Opus Limit',
    seven_day_sonnet: '7-Day Sonnet Limit',
    seven_day_oauth_apps: '7-Day OAuth Apps Limit',
    seven_day_cowork: '7-Day Cowork Limit'
  }
  if (map[k]) return map[k]
  return k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
