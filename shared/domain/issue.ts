import type { ClaimPolicy, Claims, Purpose } from './claims.js'

export function issueClaims(
  policy: ClaimPolicy,
  purpose: Purpose,
  sub: string,
  now = new Date(),
): Claims {
  const aud = policy.audiences[purpose]
  const ttl = policy.ttlSeconds[purpose]
  if (!sub || !aud || !Number.isInteger(ttl) || ttl <= 0) throw new Error('invalid input')
  return {
    iss: policy.issuer,
    aud,
    sub,
    purpose,
    iat: now.toISOString(),
    exp: new Date(now.getTime() + ttl * 1000).toISOString(),
  }
}
