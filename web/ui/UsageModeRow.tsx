import { UsageModeToggle } from './UsageModeToggle'
import r from '../resources.json'
export function UsageModeRow({ remaining, onToggle }: { remaining: boolean; onToggle: () => void }) {
  return (<div className="mb-2 flex items-center justify-between gap-2">
    <span className="text-xs text-muted-foreground">{remaining ? r.usageRemaining : r.usageUsed}</span>
    <UsageModeToggle remaining={remaining} onToggle={onToggle} />
  </div>)
}