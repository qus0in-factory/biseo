import type { PaneSummary } from './timeline'
import type { UsageMetric, UsageProvider, UsageWindow } from './usage'

const family = (modelId: string | null | undefined): string => {
  const model = modelId ?? ''
  return model.includes('argon') ? 'argon' : /^(gemini|claude|gpt)-/.exec(model)?.[1] ?? ''
}

export function paneAgyMetrics(pane: PaneSummary, p: UsageProvider): UsageMetric[] {
  if (p.provider !== 'agy') return []
  const modelFamily = family(pane.modelId)
  if (!modelFamily) return []
  return (p.metrics ?? [])
    .filter(m => m.id.split(':')[0].split('-').includes(modelFamily))
    .filter(m => m.unit === 'percent')
}

export function paneUsageWindows(pane: PaneSummary, p: UsageProvider): UsageWindow[] {
  if (p.provider !== 'agy') return p.windows
  return paneAgyMetrics(pane, p).map(m => ({
    window: 'primary', usedPercent: m.used, resetsAt: m.resetsAt,
    checkedAt: null, limitReached: m.remaining === 0, source: p.provider,
  }))
}
