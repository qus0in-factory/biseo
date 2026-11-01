import { useEffect, useState } from 'react'
import { pinApi } from '../infra/pinApi'
import config from '../../config/session.json'
import { loadPinPreference } from './pinPreference'

export type PinPreference = { preferred: boolean | null; pending: boolean }

export function usePinPreferred(enabled: boolean): PinPreference {
  const [state, setState] = useState<PinPreference>({ preferred: null, pending: enabled })
  useEffect(() => {
    if (!enabled) return
    let live = true
    loadPinPreference((signal) => pinApi.preferred(signal), config.pinPreferredTimeoutMs)
      .then((preferred) => live && setState({ preferred, pending: false }))
    return () => {
      live = false
    }
  }, [enabled])
  return state
}
