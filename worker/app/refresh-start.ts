import type { RefreshSource } from './refresh-source.js'
import type { RefreshPolicy, RefreshSession } from '../domain/refresh-types.js'

export async function startRefresh(d: RefreshSource, p: RefreshPolicy,
 host: string, subject: string, auth: RefreshSession['auth'], pinTtl: number) {
 const now = Math.floor(Date.now()/1000)
 const age = auth === 'pin' ? Math.min(pinTtl,p.absolute) : p.absolute
 const token = d.token()
 const s: RefreshSession = {
  id: crypto.randomUUID(), subject, host, auth, current_hash: await d.hash(token),
  generation: 0, expires: now+age, idle: now+Math.min(age,p.inactivity), revoked: null,
 }
 if (!await d.create(s,p,now)) throw new Error('session limit')
 return { token, age }
}
