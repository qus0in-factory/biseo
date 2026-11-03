import { ModelIcon } from './ModelIcon'
import { usageProviderFamily } from '../domain/usage-provider-family'

export function UsageProviderName({ provider }: { provider: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <ModelIcon family={usageProviderFamily(provider)} />
      <span className="min-w-0 truncate font-medium" title={provider}>{provider}</span>
    </span>
  )
}
