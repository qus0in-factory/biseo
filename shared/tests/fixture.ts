import type { ClaimPolicy } from '../domain/claims.js'

export const policy: ClaimPolicy = {
  issuer: 'biseo',
  audiences: { 'user-session': 'biseo-user', service: 'biseo-service' },
  ttlSeconds: { 'user-session': 3600, service: 300 },
  clockToleranceSeconds: 5,
}
