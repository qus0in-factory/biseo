import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { readOpencodeDbCredential } from './opencode-db-token.js'
import { parseGrokBilling } from './grok-billing-parse.js'

export async function fetchGrokUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const token = readOpencodeDbCredential('xai')
    if (!token) return unknownUsage('grok')
    const res = await fetch('https://cli-chat-proxy.grok.com/v1/billing?format=credits', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return unknownUsage('grok')
    const data = await res.json()
    return parseGrokBilling(data, now)
  } catch {
    return unknownUsage('grok')
  }
}
