import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const res = await fetch(ep().ollama, { signal: AbortSignal.timeout(to()) })
    if (!res.ok) return unknownUsage('ollama')
    const w: WindowUsage = {
      window: 'primary',
      usedPercent: null,
      resetsAt: null,
      checkedAt: now.toISOString(),
      limitReached: false,
      source: 'ollama'
    }
    const windows = [w]
    return { provider: 'ollama', state: 'available', metrics: windowsToMetrics(windows), windows }
  } catch {
    return unknownUsage('ollama')
  }
}
