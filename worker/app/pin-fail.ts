import type { PinLoginDeps, PinLoginResult } from './pin-login-types.js'

export async function failPin(
  d: PinLoginDeps,
  ipScope: string,
  now: number,
): Promise<PinLoginResult> {
  const base = { windowSeconds: d.limits.windowSeconds, lockSeconds: d.limits.lockSeconds }
  const [ipLocked, globalLocked] = await Promise.all([
    d.attempts.fail(ipScope, { ...base, max: d.limits.max }, now),
    d.attempts.fail('global', { ...base, max: d.limits.globalMax }, now),
  ])
  return { ok: false, status: ipLocked || globalLocked ? 429 : 401 }
}
