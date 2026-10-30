import { MarkdownToggleTrack } from './MarkdownToggleTrack'
import r from '../resources.json'

const res = r as any

export function UsageModeToggle({ remaining, onToggle }: { remaining: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={remaining}
      aria-label={remaining ? res.usageRemaining : res.usageUsed}
      className="relative flex h-11 w-20 shrink-0 cursor-pointer items-center justify-center bg-transparent p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onClick={onToggle}>
      <MarkdownToggleTrack on={remaining}
        left={<span className="relative z-10 text-xs">{res.usageRemaining}</span>}
        right={<span className="relative z-10 text-xs">{res.usageUsed}</span>} />
    </button>
  )
}