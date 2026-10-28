import type { Context } from 'hono'
import type { SessionBindings } from './types.js'
import type { RateCheck } from './rate-limit-types.js'
import { createKvAttemptStore } from '../infra/kv-attempt-store.js'
import { hashIp } from '../infra/ip-hash.js'
import { getAttemptConfig } from './attempt-config.js'

export async function checkRateLimit(c: Context<{ Bindings: SessionBindings }>): Promise<RateCheck> {
  const kv = c.env.LOGIN_ATTEMPTS
  if (!kv) return { ok: false, status: 500, error: 'misconfigured' }
  const ip = c.req.header('cf-connecting-ip')
  if (!ip) return { ok: false, status: 429, error: 'rate_limit_exceeded' }
  const store = createKvAttemptStore(kv)
  const key = await hashIp(ip)
  const { maxAttempts, ttlSeconds } = getAttemptConfig(c.env)
  if ((await store.get(key)) >= maxAttempts) {
    return { ok: false, status: 429, error: 'rate_limit_exceeded' }
  }
  return { ok: true, key, store, ttl: ttlSeconds }
}
