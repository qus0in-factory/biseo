import ky from './sessionHttp'
import { sessionLock } from './sessionLock'
import { sessionHeaders } from './refreshSession'
import { signalSession } from './sessionSignal'
import type { AuthPort } from '../domain/auth'
import { authWrap } from './authWrap'

export const authApi: AuthPort = {
  login: (pw) =>
    authWrap(async () => {
      await ky.post('/api/login', {
        json: { password: pw },
        retry: 0,
        credentials: 'same-origin',
      })
    }),
  loginPin: (pin) =>
    authWrap(async () => {
      await ky.post('/api/login/pin', { json: { pin }, retry: 0, credentials: 'same-origin' })
    }),
  logout: () =>
    authWrap(async () => {
      await sessionLock(async () => {
        await ky.post('/api/logout', { retry: 0, credentials: 'same-origin', headers: sessionHeaders })
        signalSession('expired')
      })
    }),
  session: () =>
    authWrap(async () => {
      await ky.get('/api/session', { retry: 0, credentials: 'same-origin' })
    }),
}
