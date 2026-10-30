import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { readOpencodeDbCredential } from './opencode-db-token.js'
import { parseGrokBilling } from './grok-billing-parse.js'

export async function fetchGrokUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const token = readOpencodeDbCredential('xai')
    if (!token) return unknownUsage('grok')
    const headers = {
      Authorization: `Bearer ${token}`,
      'X-XAI-Token-Auth': 'xai-grok-cli',
      'x-grok-client-version': '1.0.0',
      Accept: 'application/json'
    }
    const res = await fetch(ep().grok, { headers, signal: AbortSignal.timeout(to()) })
    if (!res.ok) return unknownUsage('grok')
    return parseGrokBilling(await res.json(), now)
  } catch {
    return unknownUsage('grok')
  }
}
