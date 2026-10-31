export type PinVerifier = {
  verify(pin: string, stored: string): Promise<boolean>
}

export type PinStore = {
  getHash(): Promise<string | null>
  setHash(hash: string, actor: string, at: string): Promise<void>
  clear(): Promise<void>
}

export type TrustedIpStore = {
  has(ip: string): Promise<boolean>
  add(ip: string, actor: string, at: string): Promise<void>
  remove(ip: string): Promise<void>
}

export type PinAttemptLimits = {
  max: number
  windowSeconds: number
  lockSeconds: number
}

export type PinAttemptStore = {
  locked(scope: string, now: number): Promise<boolean>
  fail(scope: string, limits: PinAttemptLimits, now: number): Promise<boolean>
  clear(scope: string): Promise<void>
}
