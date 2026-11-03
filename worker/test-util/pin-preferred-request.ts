import app from '../index.js'
import { IP } from './pin-request.js'

export const PIN_PREFERRED_URL = 'https://biseo.qus0in.dev/api/login/pin-preferred'

export const pinPreferredReq = (env: any, ip: string | null = IP, url = PIN_PREFERRED_URL) =>
  app.fetch(new Request(url, { headers: ip ? { 'CF-Connecting-IP': ip } : {} }), env)

export const pinPreferredBody = async (r: Response) =>
  (await r.json()) as { pinPreferred: boolean }
