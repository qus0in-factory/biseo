import config from '../../config/session.json'

export async function needsRefresh() {
 const res = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
 if (res.status === 401) return true
 if (!res.ok) throw new Error('session temporarily unavailable')
 const body = await res.json().catch(() => null) as { expiresAt?: string } | null
 const expiry = Date.parse(body?.expiresAt || '')
 return Number.isFinite(expiry) && expiry-Date.now() <= config.refreshAheadSeconds*1000
}
