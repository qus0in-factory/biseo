import type { ClaimPolicy } from '../../shared/domain/claims.js'
import type { ServiceTokenEnv } from './service-token-env.js'

const MAX_TTL = 300

const serviceTtl = (value?: string) => {
  const ttl = Number(value ?? MAX_TTL)
  return Number.isInteger(ttl) && ttl > 0 && ttl <= MAX_TTL ? ttl : 0
}

export function getServiceTokenPolicy(env: ServiceTokenEnv): ClaimPolicy {
  return {
    issuer: env.SERVICE_TOKEN_ISSUER || 'biseo',
    audiences: {
      'user-session': env.TOKEN_AUDIENCE || 'biseo-user',
      service: env.SERVICE_TOKEN_AUDIENCE || 'biseo-service',
    },
    ttlSeconds: {
      'user-session': Number(env.TOKEN_TTL_SECONDS) || 3600,
      service: serviceTtl(env.SERVICE_TOKEN_TTL_SECONDS),
    },
    clockToleranceSeconds: Number(env.CLOCK_TOLERANCE_SECONDS) || 5,
  }
}

export const serviceTokenSubject = (env: ServiceTokenEnv) =>
  env.SERVICE_TOKEN_SUBJECT || 'biseo-worker'
