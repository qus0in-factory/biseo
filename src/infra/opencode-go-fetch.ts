import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { readOpencodeDbCredential } from './opencode-db-token.js'
import { parseOpencodeGo } from './opencode-go-parse.js'

export async function fetchOpencodeGoUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const token = readOpencodeDbCredential('opencode')
    if (!token) return unknownUsage('opencode-go')
    const res = await fetch(ep().opencodeGo, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(to())
    })
    if (!res.ok) return unknownUsage('opencode-go')
    return parseOpencodeGo(await res.json(), now)
  } catch {
    return unknownUsage('opencode-go')
  }
}
