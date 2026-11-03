import { useState } from 'react'
import type { UsageProvider } from '../domain/usage'
import { useUsageHidden } from '../app/useUsageHidden'
import { useUsageOrder } from '../app/useUsageOrder'
import { UsageDashboardContent } from './UsageDashboardContent'
import { UsageDashboardSettings } from './UsageDashboardSettings'

type P = {
  providers: UsageProvider[]
  remaining?: boolean
  settingsOpen?: boolean
  onSettingsOpenChange?: (open: boolean) => void
}

export function UsageDashboard({ providers, remaining = true, settingsOpen, onSettingsOpenChange }: P) {
  const { providers: ordered, move } = useUsageOrder(providers)
  const { hidden, toggle, showAll } = useUsageHidden()
  const [local, setLocal] = useState(false)
  const open = settingsOpen ?? local
  const setOpen = onSettingsOpenChange ?? setLocal
  const visible = ordered.filter((p) => !hidden.includes(p.provider))
  return (
    <>
      <UsageDashboardSettings
        open={open}
        providers={ordered}
        hidden={hidden}
        onMove={move}
        onToggle={toggle}
        onShowAll={showAll}
        onClose={() => setOpen(false)}
      />
      <UsageDashboardContent providers={visible} remaining={remaining} onOpenSettings={() => setOpen(true)} />
    </>
  )
}
