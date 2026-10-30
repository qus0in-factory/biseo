import { Eye, Code2 } from 'lucide-react'

export function MarkdownToggleTrack({ raw }: { raw: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex h-7 w-16 items-center justify-between rounded-full border border-border bg-surface px-1">
      <Eye className={`relative z-10 h-4 w-4 ${raw ? 'text-muted-foreground' : 'text-foreground'}`} aria-hidden="true" />
      <Code2 className={`relative z-10 h-4 w-4 ${raw ? 'text-foreground' : 'text-muted-foreground'}`} aria-hidden="true" />
      <span className={`absolute left-1 top-1 h-5 w-5 rounded-full border border-border bg-card shadow-sm transition-transform ${raw ? 'translate-x-9' : ''}`} />
    </span>
  )
}
