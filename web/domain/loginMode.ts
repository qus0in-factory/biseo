export type LoginMode = 'pin' | 'password'

export function resolveLoginMode(pinAvailable: boolean, passwordChosen: boolean): LoginMode {
  return pinAvailable && !passwordChosen ? 'pin' : 'password'
}

export function isLoginPending(
  pinPreferred: boolean | null | undefined,
  hasPinLogin: boolean,
  autoPending: boolean,
): boolean {
  return pinPreferred === undefined && hasPinLogin && autoPending
}
