import type { UsageProvider } from './usage'
import { formatZoned } from './formatZoned'

type Mark = { source?: string | null; checkedAt?: string | null }

const TZ = 'Asia/Seoul'

export const cacheNote = (p: UsageProvider, l: Record<string, string>): string | null => {
  const m = p as UsageProvider & Mark
  if (p.provider !== 'claude' || m.source !== 'claude-cache') return null
  const at = m.checkedAt ? ` · ${l.usageLastSuccess} ${formatZoned(m.checkedAt, TZ)}` : ''
  return `${l.usageStale}${at}`
}
