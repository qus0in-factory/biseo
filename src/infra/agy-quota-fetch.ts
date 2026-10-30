import { groupModelBuckets } from './agy-quota-models.js'
import { to } from './agy-usage-to.js'

export async function fetchAgyModelBuckets(token: string) {
  try {
    const url = 'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota'
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'antigravity/1.0.0' }
    const res = await fetch(url, { method: 'POST', headers, body: '{}', signal: AbortSignal.timeout(to()) })
    if (!res.ok) return []
    const data: any = await res.json()
    return groupModelBuckets(data?.buckets)
  } catch {
    return []
  }
}
