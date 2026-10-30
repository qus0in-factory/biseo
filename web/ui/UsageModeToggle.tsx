import { MarkdownToggleTrack } from './MarkdownToggleTrack'
import r from '../resources.json'

export function UsageModeToggle({ remaining, onToggle }: { remaining: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={remaining}
      aria-label={remaining ? r.usageRemaining : r.usageUsed}
      className="relative flex h-11 w-auto min-w-20 shrink-0 cursor-pointer items-center justify-center bg-transparent p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onClick={onToggle}>
      <MarkdownToggleTrack on={!remaining} className="w-auto min-w-20"
        left={<span className="relative z-10 whitespace-nowrap px-1 text-xs">{r.usageRemaining}</span>}
        right={<span className="relative z-10 whitespace-nowrap px-1 text-xs">{r.usageUsed}</span>} />
    </button>
  )
}
