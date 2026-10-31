import type { PaneSummary } from './timeline'
import type { UsageProvider, UsageWindow } from './usage'
export function paneUsageWindows(pane: PaneSummary, p: UsageProvider): UsageWindow[] {
 if (p.provider !== 'agy') return p.windows
 const model = pane.modelId ?? ''
 const family = model.startsWith('gemini-argon-') ? 'argon' :
  /^(gemini|claude|gpt)-/.exec(model)?.[1]
 if (!family) return []
 return (p.metrics ?? []).filter(m => m.id.split(':')[0].split('-').includes(family))
  .filter(m => m.unit === 'percent').map(m => ({
   window: 'primary', usedPercent: m.used, resetsAt: m.resetsAt,
   checkedAt: null, limitReached: m.remaining === 0, source: p.provider,
  }))
}
