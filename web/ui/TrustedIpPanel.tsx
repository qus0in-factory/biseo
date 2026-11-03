import { LoadingState } from './LoadingState'
import { AsyncFallback } from './AsyncFallback'
import { TrustedIpSettings } from './TrustedIpSettings'
import { usePinStatus } from './usePinStatus'
import r from '../resources.json'
export function TrustedIpPanel() {
 const {status, failed, load} = usePinStatus()
 if (failed) return <AsyncFallback errorText={r.serverError} onRetry={load} />
 if (!status) return <LoadingState />
 return <TrustedIpSettings s={status} onChange={load} />
}
