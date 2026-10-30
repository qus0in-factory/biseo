import { agyRefreshConfig, agyTokenUrl } from './agy-token-config.js'
import { agyGrantBody, type AgyRefreshed } from './agy-token-grant.js'
import { to } from './agy-usage-to.js'

export async function refreshAgyToken(refresh: string, nowMs = Date.now()): Promise<AgyRefreshed | null> {
  const c = agyRefreshConfig()
  if (!c.clientId) return null
  try {
    const r = await fetch(agyTokenUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: agyGrantBody(refresh, c),
      signal: AbortSignal.timeout(to())
    })
    if (!r.ok) return null
    const d: any = await r.json()
    if (typeof d?.access_token !== 'string') return null
    const s = Number(d?.expires_in)
    const rt = typeof d?.refresh_token === 'string' ? d.refresh_token : null
    return { access: d.access_token, expiresAt: s > 0 ? nowMs + s * 1000 : null, refresh: rt }
  } catch {
    return null
  }
}
