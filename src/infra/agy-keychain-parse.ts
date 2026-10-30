import type { AgyTokenFile } from './agy-token-file.js'

function fromTokenObject(t: any): AgyTokenFile | null {
  if (typeof t?.access_token !== 'string') return null
  const exp = typeof t?.expiry === 'string' ? Date.parse(t.expiry) : NaN
  const refresh = typeof t?.refresh_token === 'string' ? t.refresh_token : null
  return { access: t.access_token, refresh, expiresAt: Number.isFinite(exp) ? exp : null }
}

export function parseAgyKeychainValue(raw: string | null): AgyTokenFile | null {
  if (!raw) return null
  const v = raw.trim()
  if (!v) return null
  if (v[0] === '{') {
    try {
      const d: any = JSON.parse(v)
      return fromTokenObject(d?.token ?? d)
    } catch {
      return null
    }
  }
  return { access: v, refresh: null, expiresAt: null }
}
