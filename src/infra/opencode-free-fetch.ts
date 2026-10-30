import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { readOpencodeDbCredential } from './opencode-db-token.js'
import { parseOpencodeFree } from './opencode-free-parse.js'

export async function fetchOpencodeFreeUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const t = readOpencodeDbCredential('opencode')
    if (!t) return unknownUsage('opencode-free')
    const b = JSON.stringify({ model: 'big-pickle', messages: [{ role: 'user', content: 'p' }], max_tokens: 1 })
    const h = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }
    const res = await fetch(ep().opencodeFree, { method: 'POST', headers: h, body: b, signal: AbortSignal.timeout(to()) })
    return parseOpencodeFree(res.status, res.headers, await res.json().catch(() => null), now)
  } catch {
    return unknownUsage('opencode-free')
  }
}
