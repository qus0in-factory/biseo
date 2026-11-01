import { createD1TrustedIp } from '../infra/d1-trusted-ip.js'
import { trustedIpGuard } from './trusted-ip-guard.js'
import { jsonNoStore, type Ctx } from './timeline-guards.js'

export async function addTrustedIp(c: Ctx) {
  const g = await trustedIpGuard(c)
  if (!g.ok) return g.res
  await createD1TrustedIp(g.db).add(g.ip, g.actor, new Date().toISOString())
  return jsonNoStore(c, { ok: true, ip: g.ip, trusted: true }, 200)
}

export async function removeTrustedIp(c: Ctx) {
  const g = await trustedIpGuard(c)
  if (!g.ok) return g.res
  await createD1TrustedIp(g.db).remove(g.ip)
  return jsonNoStore(c, { ok: true, ip: g.ip, trusted: false }, 200)
}
