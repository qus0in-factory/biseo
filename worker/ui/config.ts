import type { ClaimPolicy } from '../../shared/domain/claims.js'
import type { SessionBindings } from './types.js'

export const DEFAULT_COOKIE_NAME = 'biseo_session'

export function getCookieOptions(env: SessionBindings, maxAge?: number) {
  const age = maxAge ?? (Number(env.COOKIE_MAX_AGE_SECONDS) || 3600)
  const sameSite = (env.COOKIE_SAME_SITE || 'Lax') as 'Strict' | 'Lax' | 'None'
  return {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite,
    maxAge: age,
  }
}

export function getClaimPolicy(env: SessionBindings): ClaimPolicy {
  return {
    issuer: env.TOKEN_ISSUER || 'biseo',
    audiences: {
      'user-session': env.TOKEN_AUDIENCE || 'biseo-user',
      service: 'biseo-service',
    },
    ttlSeconds: {
      'user-session': Number(env.TOKEN_TTL_SECONDS) || 3600,
      service: 300,
    },
    clockToleranceSeconds: Number(env.CLOCK_TOLERANCE_SECONDS) || 5,
  }
}
