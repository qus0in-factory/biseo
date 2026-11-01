export function signalSession(state: 'expired' | 'active') {
 const value = `${state}:${crypto.randomUUID()}`
 try { localStorage.setItem('biseo-session-result', value) } catch {}
 if (state === 'expired') window.dispatchEvent(new Event('biseo-session-expired'))
}
export function bindSessionExpiry(expire: () => void) {
 const storage = (e: StorageEvent) => {
  if (e.key === 'biseo-session-result' && e.newValue?.startsWith('expired:')) expire()
 }
 window.addEventListener('biseo-session-expired', expire)
 window.addEventListener('storage', storage)
 return () => {
  window.removeEventListener('biseo-session-expired', expire)
  window.removeEventListener('storage', storage)
 }
}
