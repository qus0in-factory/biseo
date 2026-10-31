import type { RefreshSource } from './refresh-source.js'

export async function currentRefresh(d: RefreshSource, token: string,
 host: string, now: number) {
 if (!/^[a-f0-9]{64}$/.test(token)) return null
 const hash = await d.hash(token)
 const s = await d.read(hash,host)
 if (!s || s.revoked !== null) return null
 if (s.current_hash !== hash || s.expires <= now || s.idle <= now) {
  await d.revoke(s.id,now)
  return null
 }
 return { s, hash }
}
