import { useEffect } from 'react'
import { refreshSession } from '../infra/refreshSession'
import { bindSessionExpiry } from '../infra/sessionSignal'
import config from '../../config/session.json'

export function useSessionMaintenance(active: boolean, expire: () => void) {
 useEffect(() => bindSessionExpiry(expire), [expire])
 useEffect(() => {
  if (!active) return
  const check = () => { void refreshSession().catch(() => {}) }
  const timer = window.setInterval(check, config.checkIntervalMs)
  window.addEventListener('focus', check)
  return () => {
   window.clearInterval(timer)
   window.removeEventListener('focus', check)
  }
 }, [active])
}
