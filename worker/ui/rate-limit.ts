import type { Context } from 'hono'
import type { SessionBindings } from './types.js'

export async function checkRateLimit(c: Context<{ Bindings: SessionBindings }>) {
  const rl = c.env.LOGIN_RATE_LIMITER
  if (!rl) return 'misconfigured' as const
  const ip = c.req.header('cf-connecting-ip')
  if (!ip) return 'rate_limit_exceeded' as const
  const res = await rl.limit({ key: ip })
  return res.success ? 'ok' as const : 'rate_limit_exceeded' as const
}

