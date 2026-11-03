import type { ReactNode } from 'react'
import { UsageModeToggle } from './UsageModeToggle'
import r from '../resources.json'
export function UsageModeRow({ remaining, onToggle, action }: {
  remaining: boolean; onToggle: () => void; action?: ReactNode
}) {
  return (<div className="mb-2 flex items-center justify-between gap-2">
    <span className="text-xs text-muted-foreground">{remaining ? r.usageRemaining : r.usageUsed}</span>
    <div className="flex items-center gap-1">
      <UsageModeToggle remaining={remaining} onToggle={onToggle} />
      {action}
    </div>
  </div>)
}
