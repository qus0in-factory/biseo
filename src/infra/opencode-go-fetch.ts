import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { readOpencodeDbCredential } from './opencode-db-token.js'
import { parseOpencodeGo } from './opencode-go-parse.js'

export async function fetchOpencodeGoUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const token = readOpencodeDbCredential('opencode')
    if (!token) return unknownUsage('opencode-go')
    const res = await fetch('https://opencode.ai/zen/go/v1/usage', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return unknownUsage('opencode-go')
    const data = await res.json()
    return parseOpencodeGo(data, now)
  } catch {
    return unknownUsage('opencode-go')
  }
}
