export type LoginMode = 'pin' | 'password'

export function resolveLoginMode(pinAvailable: boolean, passwordChosen: boolean): LoginMode {
  return pinAvailable && !passwordChosen ? 'pin' : 'password'
}
