import type { PinStatus } from '../domain/pin'
import { PinSetupForm } from './PinSetupForm'
import { TrustedIpView } from './TrustedIpView'
import r from '../resources.json'
export function TrustedIpSettings({s, onChange}: {s: PinStatus; onChange: () => void}) {
 return <section aria-label={r.pinPanelTitle}>
  <h2 className="text-sm font-semibold">{r.pinPanelTitle}</h2>
  <TrustedIpView s={s} onChange={onChange} />
  {s.canManage && <div className="mt-3">
   <PinSetupForm configured={s.pinConfigured} onChange={onChange} />
  </div>}
 </section>
}
