import { getCookie, setCookie } from 'hono/cookie'
import type { Ctx } from './timeline-guards.js'

export const refreshCookieName = '__Secure-biseo_refresh'
export const readRefreshCookie = (c: Ctx) => getCookie(c, refreshCookieName)
export function setRefreshCookie(c: Ctx, token: string, age: number) {
 setCookie(c, refreshCookieName, token, {
  path: '/api', secure: true, httpOnly: true, sameSite: 'Strict', maxAge: age,
 })
}
