import type { UsageProvider } from './usage'
import { formatZoned } from './formatZoned'
import { getLastCheckedAt } from './usage-auth-state'

type Mark = { source?: string | null; checkedAt?: string | null }

const TZ = 'Asia/Seoul'

export const cacheNote = (p: UsageProvider, l: Record<string, string>): string | null => {
  const m = p as UsageProvider & Mark
  if (p.provider !== 'claude' || !(m.source === 'claude-cache' ||
    m.source === 'claude-stale' || p.windows.some(w => w.source === 'claude-stale'))) return null
  const checked = getLastCheckedAt(p)
  const at = checked ? ` · ${l.usageLastSuccess} ${formatZoned(checked, TZ)}` : ''
  return `${l.usageStale}${at}`
}
