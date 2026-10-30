import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseClaudeUsage } from './claude-oauth-parse.js'

export async function fetchClaudeUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const raw = await readFile(join(homedir(), '.claude', '.credentials.json'), 'utf8')
    const t = JSON.parse(raw).claudeAiOauth?.accessToken
    if (!t) return unknownUsage('claude')
    const headers = { Authorization: `Bearer ${t}`, 'anthropic-beta': 'oauth-2025-04-20', Accept: 'application/json' }
    const res = await fetch(ep().claude, { headers, signal: AbortSignal.timeout(to()) })
    if (!res.ok) return unknownUsage('claude')
    return parseClaudeUsage(await res.json(), now)
  } catch {
    return unknownUsage('claude')
  }
}
