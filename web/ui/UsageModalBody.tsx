import { useState } from 'react'
import { UsageDashboardAsync } from './UsageDashboardAsync'
import { UsageModeRow } from './UsageModeRow'
import { UsageModalActions } from './UsageModalActions'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { useUsageMode } from '../app/useUsageMode'

export function UsageModalBody({ enabled }: { enabled: boolean }) {
  const { state, retry } = useUsage(usageApi, enabled)
  const { remaining, toggle: toggleMode } = useUsageMode()
  const [open, setOpen] = useState(false)
  return (
    <>
      <UsageModeRow
        remaining={remaining}
        onToggle={toggleMode}
        action={<UsageModalActions retry={retry} loading={state.status === 'loading'}
          open={open} onToggle={() => setOpen((v) => !v)} />}
      />
      <UsageDashboardAsync
        state={state}
        retry={retry}
        remaining={remaining}
        settingsOpen={open}
        onSettingsOpenChange={setOpen}
      />
    </>
  )
}
