import { useState } from 'react'
import { saveLoginMode } from '../domain/loginMode'
import r from '../resources.json'

export function useLoginMode(preferred: boolean | null = null) {
  const [manual, setManual] = useState<boolean | null>(null)
  const pinMode = manual ?? preferred === true
  const setMode = (pin: boolean) => {
    setManual(pin)
    const s = typeof window === 'undefined' ? null : window.localStorage
    saveLoginMode(s, r.loginModeStorageKey, pin ? 'pin' : 'password')
  }
  return [pinMode, setMode] as const
}
