import { useState, useCallback } from 'react'
import {
  canSubmit,
  toAuthCode,
  type AuthCode,
  type AuthPort,
} from '../domain/auth'
export function useAuth(port: AuthPort) {
  const [authed, setAuthed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState<AuthCode>(null)
  async function login(pw: string) {
    if (!canSubmit(pw)) {
      setCode('needPassword')
      return
    }
    setBusy(true)
    try {
      await port.login(pw)
      setAuthed(true)
      setCode(null)
    } catch (e) {
      setCode(toAuthCode(e))
      setAuthed(false)
    } finally {
      setBusy(false)
    }
  }
  async function logout() {
    setBusy(true)
    try {
      await port.logout()
      setAuthed(false)
      setCode(null)
    } catch (e) {
      setCode(toAuthCode(e))
    } finally {
      setBusy(false)
    }
  }
  const expire = useCallback(() => {
    setAuthed(false)
    setCode(null)
  }, [])
  return { authed, busy, code, login, logout, expire }
}
