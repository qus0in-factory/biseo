import { parseUsage } from '../../worker/app/usage-sync'
import { groupUsage } from '../../worker/app/usage-group'
const metric = (id: string, used: number) => ({ id, unit: 'percent', used, limit: 100 })
export const panelProviders = groupUsage(parseUsage({ providers: [
  { provider: 'claude', state: 'available', metrics: [metric('five_hour', 32), metric('seven_day', 61)] },
  { provider: 'codex', state: 'available', windows: [{ window: '5h', usedPercent: 4 }] },
  { provider: 'agy', state: 'limited', metrics: [
    metric('gemini:Gemini Models:gemini-weekly', 30), metric('argon:Gemini 4 Argon:weekly', 100),
  ] },
  { provider: 'ollama', state: 'available', metrics: [
    { id: 'included_balance', unit: 'currency', used: 0.3, limit: 10 },
  ] },
  { provider: 'opencode-go', state: 'limited', metrics: [metric('monthly', 100)] },
  { provider: 'grok', state: 'limited', metrics: [metric('primary', 100)] },
] }))
