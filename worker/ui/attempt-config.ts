import type { SessionBindings } from './types.js'

export function getAttemptConfig(env: SessionBindings) {
  return {
    maxAttempts: Number(env.LOGIN_MAX_ATTEMPTS) || 5,
    ttlSeconds: Math.max(60, Number(env.LOGIN_ATTEMPT_TTL_SECONDS) || 60),
  }
}
