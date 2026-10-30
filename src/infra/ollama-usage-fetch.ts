import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) })
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
    return {
      provider: 'ollama',
      state: 'available',
      windows: [w]
    }
  } catch {
    return unknownUsage('ollama')
  }
}
