import { useState } from 'react'
import { Button } from '../components/ui/button'
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
    <Button type="button" variant="outline" onClick={() => void toggle()} disabled={busy}>
      {trusted ? r.untrustIp : r.trustIp}
    </Button>
  )
}
