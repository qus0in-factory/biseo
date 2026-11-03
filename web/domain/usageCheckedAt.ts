import type { UsageProvider } from './usage'

export type UsageCheckedMode = { mode: 'row' } | { mode: 'footer'; at: string }

export function usageCheckedMode(provider: UsageProvider): UsageCheckedMode {
  const values = provider.windows.map((w) => w.checkedAt)
  if (values.length === 0 || values.some((v) => !v)) return { mode: 'row' }
  const unique = new Set(values)
  return unique.size === 1 ? { mode: 'footer', at: values[0]! } : { mode: 'row' }
}
