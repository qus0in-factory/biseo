import { Eye, Code2 } from 'lucide-react'
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
      className="relative flex h-11 w-14 shrink-0 cursor-pointer items-center justify-between rounded-full border border-border bg-surface px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onClick={onToggle}
    >
      <Eye className={`relative z-10 h-4 w-4 ${raw ? 'text-muted-foreground' : 'text-foreground'}`} aria-hidden="true" />
      <Code2 className={`relative z-10 h-4 w-4 ${raw ? 'text-foreground' : 'text-muted-foreground'}`} aria-hidden="true" />
      <span aria-hidden="true" className={`absolute left-1 top-1 h-9 w-6 rounded-full border border-border bg-card shadow-sm transition-transform ${raw ? 'translate-x-6' : ''}`} />
    </button>
  )
}
