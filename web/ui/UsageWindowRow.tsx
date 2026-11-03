import type { UsageWindow } from '../domain/usage'
import { UsageWindowTime } from './UsageWindowTime'
import { UsageWindowValue } from './UsageWindowValue'

export function UsageWindowRow({ provider, value, remaining = true, showChecked = true }: {
  provider: string; value: UsageWindow; remaining?: boolean; showChecked?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 py-1.5">
      <UsageWindowValue provider={provider} value={value} remaining={remaining} />
      <UsageWindowTime value={value} showChecked={showChecked} />
    </div>
  )
}
