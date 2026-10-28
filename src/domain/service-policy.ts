import { validateClaims } from '../../shared/domain/validate.js'
export type ServicePolicy = { issuer: string; audience: string }
const TTL = 300
const SKEW = 5
export function checkServiceClaims(v: unknown, p: ServicePolicy): void {
  validateClaims({ issuer: p.issuer, audiences: { 'user-session': p.audience, service: p.audience }, ttlSeconds: { 'user-session': TTL, service: TTL }, clockToleranceSeconds: SKEW }, 'service', v)
}
