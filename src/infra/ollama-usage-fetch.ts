import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const res = await fetch(ep().ollama, { signal: AbortSignal.timeout(to()) })
    if (!res.ok) return unknownUsage('ollama')
    const chk = now.toISOString()
    const w: WindowUsage = {
      window: 'primary',
      usedPercent: null,
      resetsAt: null,
      checkedAt: chk,
      limitReached: false,
      source: 'ollama'
    }
    return { provider: 'ollama', state: 'available', windows: [w] }
  } catch {
    return unknownUsage('ollama')
  }
}
