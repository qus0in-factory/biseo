import { useEffect, useState } from 'react'
import { pinApi } from '../infra/pinApi'

export function usePinPreferred(enabled: boolean): boolean | null {
  const [preferred, setPreferred] = useState<boolean | null>(null)
  useEffect(() => {
    if (!enabled) return
    let live = true
    pinApi
      .preferred()
      .then((v) => live && setPreferred(v))
      .catch(() => live && setPreferred(false))
    return () => {
      live = false
    }
  }, [enabled])
  return preferred
}
