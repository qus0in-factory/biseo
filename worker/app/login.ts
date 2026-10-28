import type { ClaimPolicy } from '../../shared/domain/claims.js'
import { issueClaims } from '../../shared/domain/issue.js'
import type { ClaimsSigner } from '../../shared/domain/ports.js'
import type { PasswordVerifier } from './ports.js'

export type LoginDeps = {
  verifier: PasswordVerifier
  signer: ClaimsSigner
  policy: ClaimPolicy
  storedVerifier: string
  subject: string
  now?: () => Date
}

export type LoginResult = { ok: true; token: string } | { ok: false }

const FAILED: LoginResult = { ok: false }

export async function login(deps: LoginDeps, password: unknown): Promise<LoginResult> {
  if (typeof password !== 'string' || password === '' || !deps.storedVerifier) return FAILED
  try {
    if (!(await deps.verifier.verify(password, deps.storedVerifier))) return FAILED
    const claims = issueClaims(deps.policy, 'user-session', deps.subject, deps.now?.())
    return { ok: true, token: await deps.signer.sign(claims) }
  } catch {
    return FAILED
  }
}
