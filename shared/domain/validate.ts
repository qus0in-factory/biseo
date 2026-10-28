import type { ClaimPolicy, Claims, Purpose } from './claims.js'
import { isClaims } from './guards.js'

export function validateClaims(
  policy: ClaimPolicy,
  purpose: Purpose,
  value: unknown,
  now = new Date(),
): Claims {
  if (!isClaims(value)) throw new Error('malformed')
  if (value.iss !== policy.issuer) throw new Error('issuer')
  if (value.purpose !== purpose) throw new Error('purpose')
  if (value.aud !== policy.audiences[purpose]) throw new Error('audience')
  const exp = Date.parse(value.exp)
  const iat = Date.parse(value.iat)
  const tolerance = policy.clockToleranceSeconds * 1000
  if (!Number.isFinite(exp) || !Number.isFinite(iat)) throw new Error('time')
  if (exp < now.getTime() - tolerance) throw new Error('expired')
  if (iat > now.getTime() + tolerance) throw new Error('iat')
  if (exp - iat > policy.ttlSeconds[purpose] * 1000 + tolerance) throw new Error('ttl')
  return value
}
