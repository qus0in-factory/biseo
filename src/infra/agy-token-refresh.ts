import { agyRefreshConfig } from './agy-token-config.js'
import { to } from './agy-usage-to.js'

export interface AgyRefreshed { access: string; expiresAt: number | null }

export async function refreshAgyToken(refresh: string, nowMs = Date.now()): Promise<AgyRefreshed | null> {
  const c = agyRefreshConfig()
  if (!c.clientId) return null
  try {
    const b = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: c.clientId })
    if (c.clientSecret) b.set('client_secret', c.clientSecret)
    const r = await fetch(c.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: b.toString(),
      signal: AbortSignal.timeout(to())
    })
    if (!r.ok) return null
    const d: any = await r.json()
    if (typeof d?.access_token !== 'string') return null
    const s = Number(d?.expires_in)
    return { access: d.access_token, expiresAt: s > 0 ? nowMs + s * 1000 : null }
  } catch {
    return null
  }
}
