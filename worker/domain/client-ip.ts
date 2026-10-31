import { isPublicIpv4, parseIpv4 } from './ipv4.js'
import { isPublicIpv6, parseIpv6 } from './ipv6.js'

export function parseClientIp(raw: string | null | undefined): string | null {
  if (!raw || raw !== raw.trim() || /[\s,]/.test(raw)) return null
  const v4 = parseIpv4(raw)
  if (v4) return isPublicIpv4(v4) ? v4 : null
  const v6 = parseIpv6(raw)
  if (v6) return isPublicIpv6(v6) ? v6 : null
  return null
}
