import type { UsageProvider } from './usage'
export function agyWarningFixture(gemini: number): UsageProvider {
 return {provider: 'agy', state: 'limited', windows: [{
  window: 'primary', usedPercent: 100, resetsAt: null, checkedAt: null,
  limitReached: true, source: null,
 }], metrics: ['gemini', 'argon', 'claude-gpt'].map(f => ({
  id: `${f}:pool:bucket`, label: f, unit: 'percent',
  used: f === 'gemini' ? gemini : 100, limit: 100, remaining: null, resetsAt: null,
 }))}
}
