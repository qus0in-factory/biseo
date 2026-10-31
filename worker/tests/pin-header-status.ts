import app from '../index.js'
import { HOST } from './pin-request.js'

export async function status(env: any, headers: Record<string, string>, url = `${HOST}/api/login/pin`) {
  const req = new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: new URL(url).origin, ...headers },
    body: JSON.stringify({ pin: '123456' }),
  })
  return (await app.fetch(req, env)).status
}
