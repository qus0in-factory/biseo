import { useEffect, useState } from 'react'
import { pinApi } from '../infra/pinApi'
import type { PinStatus } from '../domain/pin'
import { PinSetupForm } from './PinSetupForm'
import { TrustedIpView } from './TrustedIpView'
import r from '../resources.json'

export function TrustedIpPanel() {
  const [s, setS] = useState<PinStatus | null>(null)
  function load() {
    pinApi
      .status()
      .then(setS)
      .catch(() => setS(null))
  }
  useEffect(() => {
    void load()
  }, [])
  if (!s) return null
  return (
    <section className="rounded-md border border-border p-3" aria-label={r.pinPanelTitle}>
      <h2 className="mb-2 text-sm font-semibold">{r.pinPanelTitle}</h2>
      <TrustedIpView s={s} onChange={load} />
      {s.canManage && (
        <div className="mt-3">
          <PinSetupForm configured={s.pinConfigured} onChange={load} />
        </div>
      )}
    </section>
  )
}
