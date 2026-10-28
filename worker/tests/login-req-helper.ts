import type { SessionBindings } from '../ui/types.js'

export function postLogin(env: SessionBindings, ip: string, password: string) {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify({ password }),
  })
}
