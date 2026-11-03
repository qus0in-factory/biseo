import { useState } from 'react'
import { UsageDashboardAsync } from './UsageDashboardAsync'
import { UsageModeRow } from './UsageModeRow'
import { UsageSettingsButton } from './UsageSettingsButton'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { useUsageMode } from '../app/useUsageMode'

export function UsageModalBody({ enabled }: { enabled: boolean }) {
  const { state, retry } = useUsage(usageApi, enabled)
  const { remaining, toggle: toggleMode } = useUsageMode()
  const [settings, setSettings] = useState(false)
  return (
    <>
      <UsageModeRow
        remaining={remaining}
        onToggle={toggleMode}
        action={<UsageSettingsButton open={settings} onToggle={() => setSettings((v) => !v)} />}
      />
      <UsageDashboardAsync
        state={state}
        retry={retry}
        remaining={remaining}
        settingsOpen={settings}
        onSettingsOpenChange={setSettings}
      />
    </>
  )
}
