import { UsageModeToggle } from './UsageModeToggle'
import r from '../resources.json'
const res = r as any
export function UsageModeRow({ remaining, onToggle }: { remaining: boolean; onToggle: () => void }) {
  return (<div className="mb-2 flex items-center justify-between gap-2">
    <span className="text-xs text-muted-foreground">{remaining ? res.usageRemaining : res.usageUsed}</span>
    <UsageModeToggle remaining={remaining} onToggle={onToggle} />
  </div>)
}