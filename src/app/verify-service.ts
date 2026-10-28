import { checkServiceClaims } from '../domain/service-policy.js'
import type { ClaimsVerifier } from '../../shared/domain/ports.js'
export class ServiceAuthError extends Error {
  constructor(readonly status: 401 | 403) {
    super(status === 401 ? 'unauthorized' : 'forbidden')
  }
}
export function createVerifyService(v: ClaimsVerifier, p: { issuer: string; audience: string }) {
  return async (token?: string): Promise<void> => {
    if (!token) throw new ServiceAuthError(401)
    let claims: unknown
    try {
      claims = await v.verify(token)
    } catch {
      throw new ServiceAuthError(401)
    }
    try {
      checkServiceClaims(claims, p)
    } catch (e) {
      const m = e instanceof Error ? e.message : ''
      if (m === 'purpose' || m === 'audience') throw new ServiceAuthError(403)
      throw new ServiceAuthError(401)
    }
  }
}
