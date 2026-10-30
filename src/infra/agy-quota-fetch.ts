import { getUsageEndpoints } from '../domain/usage-endpoints.js'
import type { AgyGroup } from './agy-quota-types.js'
import { modelBucketsToGroups } from './agy-quota-models.js'
import { to } from './agy-usage-to.js'
import { AGY_USER_AGENT } from './agy-user-agent.js'

export async function fetchAgyModelGroups(token: string, probe?: { unauthorized: boolean }): Promise<AgyGroup[]> {
  try {
    const res = await fetch(getUsageEndpoints().agyQuota, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': AGY_USER_AGENT
      },
      body: '{}',
      signal: AbortSignal.timeout(to())
    })
    if (res.status === 401 && probe) probe.unauthorized = true
    if (!res.ok) return []
    const data: { buckets?: unknown } = await res.json()
    return modelBucketsToGroups(Array.isArray(data.buckets) ? data.buckets : [])
  } catch {
    return []
  }
}
