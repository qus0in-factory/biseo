import { parseClientIp } from '../domain/client-ip.js'
import { isPinHostAllowed } from '../domain/pin-host.js'
import { getPinConfig } from './pin-config.js'
import type { Ctx } from './timeline-guards.js'

export type PinRequest = ReturnType<typeof getPinConfig> & { ip: string }

export function resolvePinRequest(c: Ctx): PinRequest | null {
  const cfg = getPinConfig(c.env)
  if (!isPinHostAllowed(c.req.url, cfg.hosts)) return null
  if (c.req.raw.headers.has('cf-worker')) return null
  const ip = parseClientIp(c.req.header('cf-connecting-ip'))
  return ip ? { ...cfg, ip } : null
}
