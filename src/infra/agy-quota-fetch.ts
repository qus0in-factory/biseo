import type { AgyGroup } from './agy-quota-types.js'
import { modelBucketsToGroups } from './agy-quota-models.js'
import { to } from './agy-usage-to.js'
import { AGY_USER_AGENT } from './agy-user-agent.js'

export async function fetchAgyModelGroups(token: string): Promise<AgyGroup[]> {
  try {
    const url = process.env.BISEO_AGY_QUOTA_URL ??
      'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota'
    const res = await fetch(url, {
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
    const data: { buckets?: unknown } = await res.json()
    return modelBucketsToGroups(Array.isArray(data.buckets) ? data.buckets : [])
  } catch {
    return []
  }
}
