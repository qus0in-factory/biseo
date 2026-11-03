import type { ReactNode } from 'react'
import { UsageModeToggle } from './UsageModeToggle'
export function UsageModeRow({ remaining, onToggle, action }: {
  remaining: boolean; onToggle: () => void; action?: ReactNode
}) {
  return (<div className="mb-2 flex items-center justify-end gap-2">
    <UsageModeToggle remaining={remaining} onToggle={onToggle} />
    {action}
  </div>)
}
