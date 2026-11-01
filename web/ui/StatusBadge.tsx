import type { ComponentType } from 'react'
import type { PaneStatus } from '../domain/timeline'
import { Badge } from '../components/ui/badge'
import { statusStyle } from './paneStatusBadgeStyle'

type Icon = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>

export function StatusBadge({
  status,
  label,
  icon: Icon,
  spin = false,
  className = '',
}: {
  status: PaneStatus
  label: string
  icon: Icon
  spin?: boolean
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      aria-label={label}
      role="status"
      className={`min-w-0 flex-shrink status-${status} ${className}`}
      style={statusStyle(status)}
    >
      <Icon size={14} className={spin ? 'motion-safe:animate-spin' : ''} aria-hidden={true} />
      <span className="overflow-hidden text-ellipsis">{label}</span>
    </Badge>
  )
}
