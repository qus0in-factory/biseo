import type { ReactNode } from 'react'
import { useState } from 'react'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import { HeaderTabs } from './HeaderTabs'
import { UsageModal } from './UsageModal'
import { NotificationModal } from './NotificationModal'

export function DashboardHeader({ online, actions }: { online: boolean; actions?: ReactNode }) {
  const [tab, setTab] = useState<string | null>(null)
  return (
    <>
      <div className="col-span-full mb-2 flex min-h-11 flex-wrap items-center justify-end gap-1">
        <HeaderTabs value={tab} onSelect={setTab} />
        <ConnectionStatusBadge online={online} />
        {actions}
      </div>
      <UsageModal open={tab === 'usage'} onClose={() => setTab(null)} enabled={online} />
      <NotificationModal open={tab === 'notify'} onClose={() => setTab(null)} />
    </>
  )
}
