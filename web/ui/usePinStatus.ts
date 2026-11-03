import { useCallback, useEffect, useState } from 'react'
import { pinApi } from '../infra/pinApi'
import type { PinStatus } from '../domain/pin'
export function usePinStatus() {
 const [status, setStatus] = useState<PinStatus | null>(null)
 const [failed, setFailed] = useState(false)
 const load = useCallback(() => {
  setFailed(false)
  setStatus(null)
  void pinApi.status().then(setStatus).catch(() => setFailed(true))
 }, [])
 useEffect(load, [load])
 return {status, failed, load}
}
