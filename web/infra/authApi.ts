import ky, { HTTPError } from 'ky'
import { ApiError, loginCode, type AuthPort } from '../domain/auth'

async function wrap<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    const s = e instanceof HTTPError ? e.response.status : undefined
    throw new ApiError(loginCode(s))
  }
}

export const authApi: AuthPort = {
  login: (pw) =>
    wrap(async () => {
      await ky.post('/api/login', {
        json: { password: pw },
        retry: 0,
        credentials: 'same-origin',
      })
    }),
  logout: () =>
    wrap(async () => {
      await ky.post('/api/logout', { retry: 0, credentials: 'same-origin' })
    }),
  session: () =>
    wrap(async () => {
      await ky.get('/api/session', { retry: 0, credentials: 'same-origin' })
    }),
}
