import type { Claims } from './claims.js'

export interface ClaimsSigner {
  sign(claims: Claims): Promise<string>
}

export interface ClaimsVerifier {
  verify(token: string): Promise<unknown>
}
