import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { readAgyToken } from './agy-token.js'
import { parseAgyUsage } from './agy-usage-parse.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  const token = await readAgyToken()
  if (!token) return unknownUsage('agy')
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'antigravity/1.0.0'
    }
    const res = await fetch(ep().agy, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(to())
    })
    if (!res.ok) return unknownUsage('agy')
    return parseAgyUsage(await res.json(), now)
  } catch {
    return unknownUsage('agy')
  }
}
