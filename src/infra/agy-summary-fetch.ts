import { getUsageEndpoints } from '../domain/usage-endpoints.js'
import { to } from './agy-usage-to.js'
import { AGY_USER_AGENT } from './agy-user-agent.js'
import type { AgyGroup } from './agy-quota-types.js'

export async function fetchAgySummary(token: string): Promise<AgyGroup[]> {
  try {
    const res = await fetch(getUsageEndpoints().agy, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': AGY_USER_AGENT
      },
      body: '{}',
      signal: AbortSignal.timeout(to())
    })
    if (!res.ok) return []
    const data: { groups?: unknown } = await res.json()
    return Array.isArray(data.groups) ? data.groups : []
  } catch {
    return []
  }
}
