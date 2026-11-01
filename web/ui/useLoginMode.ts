import { useState } from 'react'
import { restoreLoginMode, saveLoginMode } from '../domain/loginMode'
import r from '../resources.json'

export function useLoginMode() {
  const [pinMode, setPinMode] = useState(() => {
    const s = typeof window === 'undefined' ? null : window.localStorage
    return restoreLoginMode(s, r.loginModeStorageKey) === 'pin'
  })
  const setMode = (pin: boolean) => {
    setPinMode(pin)
    const s = typeof window === 'undefined' ? null : window.localStorage
    saveLoginMode(s, r.loginModeStorageKey, pin ? 'pin' : 'password')
  }
  return [pinMode, setMode] as const
}
