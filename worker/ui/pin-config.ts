import type { PinLimits } from '../domain/pin-attempt.js'
import type { SessionBindings } from './types.js'

const num = (v: string | undefined, d: number) => Number(v) || d

export function getPinConfig(env: SessionBindings) {
  const limits: PinLimits = {
    max: num(env.PIN_MAX_ATTEMPTS, 5),
    windowSeconds: Math.max(60, num(env.PIN_ATTEMPT_WINDOW_SECONDS, 900)),
    lockSeconds: Math.max(1, num(env.PIN_LOCK_SECONDS, 900)),
    globalMax: num(env.PIN_GLOBAL_MAX_ATTEMPTS, 20),
    sessionTtl: Math.max(60, num(env.PIN_SESSION_TTL_SECONDS, 900)),
  }
  const hosts = (env.PIN_ALLOWED_HOSTS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return { ...limits, hosts }
}
