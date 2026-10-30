import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseGrokBilling } from './grok-billing-parse.js'

export async function queryGrokBilling(token: string, now: Date) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'X-XAI-Token-Auth': 'xai-grok-cli',
      'x-grok-client-version': '1.0.0',
      Accept: 'application/json'
    }
    const res = await fetch(ep().grok, { headers, signal: AbortSignal.timeout(to()) })
    if (!res.ok) return null
    return parseGrokBilling(await res.json(), now)
  } catch {
    return null
  }
}
