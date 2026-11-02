import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints, getUsageTimeoutMs } from '../domain/usage-endpoints.js'
import { parseCodexWham } from './codex-wham-parse.js'

export async function fetchCodexUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const raw = await readFile(`${homedir()}/.codex/auth.json`, 'utf8')
    const t = JSON.parse(raw).tokens?.access_token
    if (!t) return unknownUsage('codex', 'auth_required')
    const res = await fetch(getUsageEndpoints().codex, {
      headers: { Authorization: `Bearer ${t}` },
      signal: AbortSignal.timeout(getUsageTimeoutMs())
    })
    if (res.status === 401 || res.status === 403) return unknownUsage('codex', 'auth_required')
    return res.ok ? parseCodexWham(await res.json(), now) : unknownUsage('codex')
  } catch {
    return unknownUsage('codex')
  }
}
