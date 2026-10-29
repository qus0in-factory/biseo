import type { ReactNode } from 'react'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'

export function DashboardHeader({ online, actions }: { online: boolean; actions?: ReactNode }) {
  return (
    <div className="col-span-full mb-2 flex min-h-11 flex-wrap items-center justify-end gap-1">
      <ConnectionStatusBadge online={online} />
      {actions}
    </div>
  )
}
