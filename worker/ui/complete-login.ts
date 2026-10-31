import { attachRefresh } from './refresh-login.js'
import { jsonNoStore, type Ctx } from './timeline-guards.js'

export async function completeLogin(c: Ctx, auth: 'password' | 'pin', token: string, ttl?: number) {
 try {
  await attachRefresh(c,auth,token,ttl)
  return jsonNoStore(c,{ok:true},200)
 } catch { return jsonNoStore(c,{error:'temporarily_unavailable'},503) }
}
