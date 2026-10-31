import { useState, type FormEvent } from 'react'
import { useLoginMode } from './useLoginMode'

export type LoginFormProps = {
  busy: boolean
  onLogin: (pw: string) => void
  onPinLogin?: (pin: string) => void
}

export function useLoginForm(
  onLogin: (pw: string) => void,
  onPinLogin?: (pin: string) => void
) {
  const [pw, setPw] = useState('')
  const [pin, setPin] = useState('')
  const [pinMode, setMode] = useLoginMode()
  const usePin = pinMode && !!onPinLogin

  const submit = (e: FormEvent) => {
    e.preventDefault()
    usePin ? onPinLogin?.(pin) : onLogin(pw)
  }

  return { pw, setPw, pin, setPin, usePin, setMode, submit }
}
