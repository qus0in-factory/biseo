import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints, getUsageTimeoutMs } from '../domain/usage-endpoints.js'
import { parseCodexWham } from './codex-wham-parse.js'

export async function fetchCodexUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const authPath = join(homedir(), '.codex', 'auth.json')
    const raw = await readFile(authPath, 'utf8')
    const token = JSON.parse(raw).tokens?.access_token
    if (!token) return unknownUsage('codex')
    const res = await fetch(getUsageEndpoints().codex, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(getUsageTimeoutMs())
    })
    if (!res.ok) return unknownUsage('codex')
    const data = await res.json()
    return parseCodexWham(data, now)
  } catch {
    return unknownUsage('codex')
  }
}
