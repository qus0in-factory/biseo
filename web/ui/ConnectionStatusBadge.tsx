import { Wifi, WifiOff } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import r from '../resources.json'

export function ConnectionStatusBadge({ online }: { online: boolean }) {
  const Icon = online ? Wifi : WifiOff
  const label = online ? r.connected : r.disconnected

  return (
    <Badge variant="outline" aria-label={label} role="status" className={online ? 'text-success' : 'text-danger'}>
      <Icon size={14} aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  )
}
