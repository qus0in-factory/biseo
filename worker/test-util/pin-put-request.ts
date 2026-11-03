import { HOST } from './pin-request.js'

export function putPin(cookie: string, pin: unknown) {
  return new Request(`${HOST}/api/pin`, {
    method: 'PUT',
    headers: { Cookie: cookie, Origin: HOST, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
}

export function deletePin(cookie: string) {
  return new Request(`${HOST}/api/pin`, {
    method: 'DELETE', headers: { Cookie: cookie, Origin: HOST },
  })
}
