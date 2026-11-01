import app from '../index.js'

export const HOST = 'https://biseo.qus0in.dev'
export const IP = '203.0.113.7'

export function pinReq(pin: string, ip: string | null = IP, url = `${HOST}/api/login/pin`) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Origin: new URL(url).origin,
  }
  if (ip) headers['CF-Connecting-IP'] = ip
  return new Request(url, { method: 'POST', headers, body: JSON.stringify({ pin }) })
}

export const postPin = (env: any, pin: string, ip?: string | null) =>
  app.fetch(pinReq(pin, ip), env)

export async function passwordCookie(env: any, password: string) {
  const res = await app.fetch(
    new Request(`${HOST}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.9' },
      body: JSON.stringify({ password }),
    }),
    env,
  )
  return res.headers.get('set-cookie')!.split(';')[0]
}
