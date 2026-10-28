import type { Claims } from './claims.js'

export function isClaims(value: unknown): value is Claims {
  if (!value || typeof value !== 'object') return false
  const claims = value as Record<string, unknown>
  return typeof claims.iss === 'string' && typeof claims.aud === 'string' &&
    typeof claims.sub === 'string' && claims.sub.length > 0 &&
    (claims.purpose === 'user-session' || claims.purpose === 'service') &&
    typeof claims.iat === 'string' && typeof claims.exp === 'string'
}
