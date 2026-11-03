import type { UsageProvider } from '../domain/usage'
import { UsageProviderSettings } from './UsageProviderSettings'

type P = {
  open: boolean
  providers: UsageProvider[]
  hidden: string[]
  onMove: (from: number, to: number) => void
  onToggle: (id: string) => void
  onShowAll: () => void
  onClose: () => void
}

export function UsageDashboardSettings({ open, ...props }: P) {
  if (!open) return null
  return <UsageProviderSettings {...props} />
}
