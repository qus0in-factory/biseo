import { agyModel } from './pane-model-agy.js'
import { modelSuffixes } from './pane-model-rules.js'
export type PaneModel = { modelId: string; provider: string }
const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
export function parseModelDisplay(display: string, kind: string | null): PaneModel | null {
  const text = display.trim()
  if (!text) return null
  if (kind === 'agy') { const model = agyModel(text); return model ? build(model, 'agy') : null }
  if (kind === 'claude') return build(text, 'claude')
  const hit = modelSuffixes.find(([re]) => re.test(text))
  if (!hit) return null
  return build(text.replace(hit[0], ''), hit[1])
}
function build(name: string, provider: string): PaneModel | null {
  const modelId = id(name)
  return modelId ? { modelId, provider } : null
}
