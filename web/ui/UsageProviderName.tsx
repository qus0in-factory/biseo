import { ModelIcon } from './ModelIcon'
import { usageProviderFamily } from '../domain/usage-provider-family'
import { usageProviderLabel } from '../domain/usage-provider-label'

export function UsageProviderName({ provider }: { provider: string }) {
  const label = usageProviderLabel(provider)
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <ModelIcon family={usageProviderFamily(provider)} />
      <span className="min-w-0 truncate font-medium" title={label}>{label}</span>
    </span>
  )
}
