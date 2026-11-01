import type { ReactNode } from 'react'
import { useState } from 'react'
import type { ConnectionStatus } from '../domain/connectionStatus'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import { HeaderTabs } from './HeaderTabs'
import { UsageModal } from './UsageModal'

export function DashboardHeader({ connection, actions }: { connection: ConnectionStatus; actions?: ReactNode }) {
  const [tab, setTab] = useState<string | null>(null)
  return (
    <>
      <div className="col-span-full mb-2 flex min-h-11 flex-wrap items-center justify-end gap-1">
        <HeaderTabs value={tab} onSelect={setTab} />
        <ConnectionStatusBadge status={connection} />
        {actions}
      </div>
      <UsageModal open={tab === 'usage'} onClose={() => setTab(null)} enabled={connection === 'connected'} />
    </>
  )
}
