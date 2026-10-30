import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseOllamaBalance } from './ollama-balance-parse.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  const chk = now.toISOString()
  try {
    const res = await fetch(ep().ollama, { signal: AbortSignal.timeout(to()) })
    if (!res.ok) return unknownUsage('ollama')
    const data = await res.json()
    const metrics = parseOllamaBalance(data)
    const w: WindowUsage = { window: 'primary', usedPercent: null, resetsAt: null, checkedAt: chk, limitReached: false, source: 'ollama' }
    return { provider: 'ollama', state: 'available', metrics, windows: [w], source: 'ollama', checkedAt: chk }
  } catch {
    return unknownUsage('ollama')
  }
}
