import { singleRefresh } from './sessionLock'
import { signalSession } from './sessionSignal'
import { needsRefresh } from './sessionProbe'

export const sessionHeaders = { 'X-Biseo-CSRF': '1' }
export function refreshSession() {
 return singleRefresh(async () => {
  if (!await needsRefresh()) return
  const res = await fetch('/api/refresh', {
   method: 'POST', credentials: 'same-origin', headers: sessionHeaders,
  })
  if (res.status === 401) signalSession('expired')
  if (!res.ok) throw Object.assign(new Error('session refresh failed'), { response: res })
  signalSession('active')
 })
}
