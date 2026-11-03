import { pinEnv } from './pin-fixture.js'
import { startRefresh } from '../app/refresh-start.js'
import { refreshSource } from '../infra/refresh-source.js'
import { refreshPolicy } from '../ui/refresh-policy.js'

export const origin = 'https://biseo.qus0in.dev'
export async function refreshFixture(auth: 'pin' | 'password' = 'password') {
 const { env, db } = await pinEnv({ ALLOWED_ORIGINS: origin })
 const r = await startRefresh(refreshSource(db as any),refreshPolicy(env),new URL(origin).host,'owner',auth,900)
 return { env: { ...env, ALLOWED_ORIGINS: origin }, db, token: r.token }
}
export function refreshRequest(token: string, path = '/api/refresh', host = origin) {
 return new Request(host+path, { method: 'POST', headers: {
  Origin: host, 'X-Biseo-CSRF': '1', 'CF-Connecting-IP': '1.2.3.4',
  Cookie: `__Secure-biseo_refresh=${token}`,
 } })
}
export function refreshToken(r: Response) {
 return r.headers.getSetCookie().find(v => v.startsWith('__Secure-'))!.split(';')[0].split('=')[1]
}
