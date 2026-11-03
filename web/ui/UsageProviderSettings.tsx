import type { UsageProvider } from '../domain/usage'
import { UsageProviderSettingsHeader } from './UsageProviderSettingsHeader'
import { UsageProviderSettingsList } from './UsageProviderSettingsList'
import { UsageProviderShowAll } from './UsageProviderShowAll'
import r from '../resources.json'

type P = {
  providers: UsageProvider[]
  hidden: string[]
  onMove: (from: number, to: number) => void
  onToggle: (id: string) => void
  onShowAll: () => void
  onClose: () => void
}

export function UsageProviderSettings({ providers, hidden, onMove, onToggle, onShowAll, onClose }: P) {
  return (
    <section id="usage-provider-settings" aria-label={r.usageProviderSettings} className="mb-3 rounded-md border border-border bg-card p-3">
      <UsageProviderSettingsHeader onClose={onClose} />
      <UsageProviderSettingsList providers={providers} hidden={hidden} onMove={onMove} onToggle={onToggle} />
      <UsageProviderShowAll hidden={hidden} onShowAll={onShowAll} />
    </section>
  )
}
