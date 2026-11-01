import { setCookie } from 'hono/cookie'
import type { Context } from 'hono'
import { createAdapters } from './adapters.js'
import { DEFAULT_COOKIE_NAME, getClaimPolicy, getCookieOptions } from './config.js'
import type { SessionBindings } from './types.js'

export async function createLoginDeps(env: SessionBindings) {
  const ad = await createAdapters(env)
  if (!ad) return null
  return {
    verifier: ad.pwVerifier,
    signer: ad.signer,
    policy: getClaimPolicy(env),
    storedVerifier: ad.storedVerifier,
    subject: env.SESSION_SUBJECT || 'owner',
  }
}

export function setSessionCookie(c: Context<{ Bindings: SessionBindings }>, token: string, maxAge?: number) {
  const name = c.env.COOKIE_NAME || DEFAULT_COOKIE_NAME
  setCookie(c, name, token, getCookieOptions(c.env, maxAge))
}
