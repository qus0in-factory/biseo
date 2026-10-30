import { Eye, Code2 } from 'lucide-react'
import { MarkdownToggleTrack } from './MarkdownToggleTrack'
import r from '../resources.json'

export function MarkdownToggle({
  raw,
  onToggle,
}: {
  raw: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={raw}
      aria-label={r.markdownToggleLabel}
      className="relative flex h-11 w-20 shrink-0 cursor-pointer items-center justify-center bg-transparent p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onClick={onToggle}
    >
      <MarkdownToggleTrack
        on={raw}
        left={<Eye className={`relative z-10 h-4 w-4 ${raw ? 'text-muted-foreground' : 'text-foreground'}`} aria-hidden="true" />}
        right={<Code2 className={`relative z-10 h-4 w-4 ${raw ? 'text-foreground' : 'text-muted-foreground'}`} aria-hidden="true" />}
      />
    </button>
  )
}
