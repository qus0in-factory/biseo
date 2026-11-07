import { getUsageEndpoints, getUsageTimeoutMs } from '../domain/usage-endpoints.js'

export type ClaudeHttpResult = { status: number; retryAfter: string | null; data: unknown }

export async function requestClaudeUsage(token: string): Promise<ClaudeHttpResult> {
  const headers = { Authorization: `Bearer ${token}`, 'anthropic-beta': 'oauth-2025-04-20', Accept: 'application/json' }
  const res = await fetch(getUsageEndpoints().claude, { headers, signal: AbortSignal.timeout(getUsageTimeoutMs()) })
  const data = await res.json().catch(() => null)
  return { status: res.status, retryAfter: res.headers.get('retry-after'), data }
}
