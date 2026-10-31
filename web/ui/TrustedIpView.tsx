import r from '../resources.json'
import type { PinStatus } from '../domain/pin'
import { TrustIpButton } from './TrustIpButton'

export function TrustedIpView({ s, onChange }: { s: PinStatus; onChange: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm">
        {r.currentIp}: <code className="text-xs">{s.ip ?? r.ipUnavailable}</code>
      </p>
      {s.available && s.canManage && <TrustIpButton trusted={s.trusted} onChange={onChange} />}
      {!s.available && <span className="text-xs text-muted-foreground">{r.pinUnavailable}</span>}
      {s.available && !s.canManage && (
        <span className="text-xs text-muted-foreground">{r.pinManageRestricted}</span>
      )}
    </div>
  )
}
