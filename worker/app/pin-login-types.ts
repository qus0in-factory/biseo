import type { ClaimPolicy } from '../../shared/domain/claims.js'
import type { ClaimsSigner } from '../../shared/domain/ports.js'
import type { PinLimits } from '../domain/pin-attempt.js'
import type {
  PinAttemptStore,
  PinStore,
  PinVerifier,
  TrustedIpStore,
} from './pin-ports.js'

export type PinLoginDeps = {
  trusted: TrustedIpStore
  pin: PinStore
  attempts: PinAttemptStore
  verifier: PinVerifier
  signer: ClaimsSigner
  policy: ClaimPolicy
  subject: string
  ip: string
  limits: PinLimits
  now?: () => number
}

export type PinLoginResult =
  | { ok: true; token: string }
  | { ok: false; status: 401 | 429 }
