import { LoaderCircle, Wifi, WifiOff } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import type { ConnectionStatus } from '../domain/connectionStatus'
import r from '../resources.json'

const states = {
  connecting: { Icon: LoaderCircle, label: r.connecting, color: 'text-muted-foreground' },
  connected: { Icon: Wifi, label: r.connected, color: 'text-success' },
  disconnected: { Icon: WifiOff, label: r.disconnected, color: 'text-danger' },
}

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  const { Icon, label, color } = states[status]
  return (
    <Badge variant="outline" aria-label={label} role="status" className={`min-h-11 rounded-md px-1.5 text-xs font-medium sm:px-3 sm:text-sm ${color}`}>
      <Icon size={16} aria-hidden="true" className={status === 'connecting' ? 'motion-safe:animate-spin' : undefined} />
      <span>{label}</span>
    </Badge>
  )
}
