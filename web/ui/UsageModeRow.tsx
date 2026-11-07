import type { ReactNode } from 'react'
import { UsageModeToggle } from './UsageModeToggle'
export function UsageModeRow({ remaining, onToggle, action }: {
  remaining: boolean; onToggle: () => void; action?: ReactNode
}) {
  return (<div className="mb-2 flex flex-col items-end justify-end gap-2 sm:flex-row sm:items-center">
    <UsageModeToggle remaining={remaining} onToggle={onToggle} />
    {action}
  </div>)
}
