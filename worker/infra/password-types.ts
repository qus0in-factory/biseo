// workerd PBKDF2 iteration ceiling: https://github.com/cloudflare/workerd/issues/1346
export const WORKERD_PBKDF2_MAX_ITERATIONS = 100_000

export type Pbkdf2Config = {
  iterations: number
  keyLength: number
  digest: 'SHA-256' | 'SHA-512'
}

export const DEFAULT_PBKDF2_CONFIG: Pbkdf2Config = {
  iterations: WORKERD_PBKDF2_MAX_ITERATIONS,
  keyLength: 32,
  digest: 'SHA-256',
}

export function assertValidIterations(iterations: number): void {
  if (iterations <= 0 || iterations > WORKERD_PBKDF2_MAX_ITERATIONS) {
    throw new RangeError(
      `PBKDF2 iterations must be between 1 and ${WORKERD_PBKDF2_MAX_ITERATIONS}, got ${iterations}`
    )
  }
}
