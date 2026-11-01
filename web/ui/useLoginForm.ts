import { useState, type FormEvent } from 'react'
import { useLoginMode } from './useLoginMode'
import { usePinPreferred } from '../app/usePinPreferred'

export type LoginFormProps = {
  busy: boolean
  onLogin: (pw: string) => void
  onPinLogin?: (pin: string) => void
  pinPreferred?: boolean | null
}

export function useLoginForm(
  onLogin: (pw: string) => void,
  onPinLogin?: (pin: string) => void,
  pinPreferred?: boolean | null,
) {
  const [pw, setPw] = useState('')
  const [pin, setPin] = useState('')
  const preferred = usePinPreferred(pinPreferred === undefined && !!onPinLogin)
  const available = !!onPinLogin && (pinPreferred === undefined ? preferred : pinPreferred) === true
  const [pinMode, setMode] = useLoginMode(available)
  const usePin = available && pinMode

  const submit = (e: FormEvent) => {
    e.preventDefault()
    usePin ? onPinLogin?.(pin) : onLogin(pw)
  }

  return { pw, setPw, pin, setPin, usePin, pinAvailable: available, setMode, submit }
}
