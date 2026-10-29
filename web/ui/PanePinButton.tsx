import { Star } from 'lucide-react'

type P = { pinned?: boolean; onTogglePin?: () => void }

export function PanePinButton({ pinned = false, onTogglePin }: P) {
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-label={pinned ? '패널 고정 해제' : '패널 고정'}
      onClick={(event) => {
        event.stopPropagation()
        onTogglePin?.()
      }}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border border-border bg-surface px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      <Star className={`h-4 w-4 ${pinned ? 'fill-current text-primary' : ''}`} aria-hidden="true" />
      <span>{pinned ? '고정됨' : '고정'}</span>
    </button>
  )
}
