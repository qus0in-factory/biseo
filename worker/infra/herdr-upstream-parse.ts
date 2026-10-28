import type { UpstreamResult, UpstreamStatus } from '../app/timeline-ports.js'

const VALID = new Set<UpstreamStatus>([200, 202, 400, 401, 403, 404, 409, 500, 502, 504])

export async function parseUpstreamResponse<T>(res: Response): Promise<UpstreamResult<T>> {
  const b = (await res.json().catch(() => null)) as Record<string, unknown> | null
  if (res.ok && (res.status === 200 || res.status === 202) && b) {
    return { ok: true, status: res.status, data: b as T }
  }
  const s = VALID.has(res.status as UpstreamStatus) ? (res.status as UpstreamStatus) : 502
  const status = s === 200 || s === 202 ? 502 : s
  return { ok: false, status, body: b && typeof b === 'object' ? b : { error: 'bad_gateway' } }
}
