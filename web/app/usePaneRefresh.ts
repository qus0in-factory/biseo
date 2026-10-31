import { useEffect } from 'react'
import r from '../resources.json'
export function usePaneRefresh(reload: () => Promise<void>) {
 useEffect(() => {
  const refresh = () => { void reload() }
  window.addEventListener(r.panesChangedEvent, refresh)
  return () => window.removeEventListener(r.panesChangedEvent, refresh)
 }, [reload])
}
