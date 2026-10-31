import { useState } from 'react'
import { SettingsAction } from './SettingsAction'
import { ShieldCheck } from 'lucide-react'
import { pinApi } from '../infra/pinApi'
import r from '../resources.json'

export function TrustIpButton({ trusted, onChange }: { trusted: boolean; onChange: () => void }) {
  const [busy, setBusy] = useState(false)
  async function toggle() {
    setBusy(true)
    try {
      await (trusted ? pinApi.untrust() : pinApi.trust())
      onChange()
    } finally {
      setBusy(false)
    }
  }
  return (
    <SettingsAction icon={ShieldCheck} type="button" onClick={() => void toggle()} busy={busy}>
      {trusted ? r.untrustIp : r.trustIp}
    </SettingsAction>
  )
}
