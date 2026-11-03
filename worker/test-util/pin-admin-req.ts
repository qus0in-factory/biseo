import { HOST, IP } from './pin-request.js'

export function adminReq(path: string, cookie: string, method = 'GET', body?: unknown) {
  return new Request(`${HOST}${path}`, {
    method,
    headers: {
      Cookie: cookie,
      Origin: HOST,
      'CF-Connecting-IP': IP,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}
