import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseClaudeUsage } from './claude-oauth-parse.js'

export async function fetchClaudeUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const p = join(homedir(), '.claude', '.credentials.json')
    const raw = await readFile(p, 'utf8')
    const token = JSON.parse(raw).claudeAiOauth?.accessToken
    if (!token) return unknownUsage('claude')
    const res = await fetch('https://api.anthropic.com/api/oauth/usage', {
      headers: {
        Authorization: `Bearer ${token}`,
        'anthropic-beta': 'oauth-2025-04-20',
        Accept: 'application/json'
      }
    })
    if (!res.ok) return unknownUsage('claude')
    const data = await res.json()
    return parseClaudeUsage(data, now)
  } catch {
    return unknownUsage('claude')
  }
}
