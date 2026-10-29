import { Wifi, WifiOff } from 'lucide-react'
import r from '../resources.json'

export function ConnectionStatusBadge({ online }: { online: boolean }) {
  const Icon = online ? Wifi : WifiOff
  const label = online ? r.connected : r.disconnected
  const cls = online ? 'connected' : 'disconnected'

  return (
    <span className={`conn-status ${cls}`} aria-label={label} role="status">
      <Icon size={14} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
