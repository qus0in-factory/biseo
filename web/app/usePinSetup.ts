import { useState } from 'react'
import { pinApi } from '../infra/pinApi'
export function usePinSetup(onChange: () => void) {
 const [pin, setPin] = useState('')
 const [busy, setBusy] = useState(false)
 const [failed, setFailed] = useState(false)
 async function save() {
  setBusy(true); setFailed(false)
  try { await pinApi.setPin(pin); setPin(''); onChange() }
  catch { setFailed(true) }
  finally { setBusy(false) }
 }
 return {pin, setPin, busy, failed, save}
}
