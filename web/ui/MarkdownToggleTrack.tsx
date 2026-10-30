import type { ReactNode } from 'react'

export function MarkdownToggleTrack({
  on,
  left,
  right,
  className = 'w-16',
}: {
  on: boolean
  left: ReactNode
  right: ReactNode
  className?: string
}) {
  return (
    <span aria-hidden="true" className={`flex h-7 ${className} items-stretch overflow-hidden rounded border border-border bg-surface`}>
      <span className={`flex flex-1 items-center justify-center ${on ? 'bg-surface text-muted-foreground' : 'bg-card text-foreground'}`}>{left}</span>
      <span className={`flex flex-1 items-center justify-center ${on ? 'bg-card text-foreground' : 'bg-surface text-muted-foreground'}`}>{right}</span>
    </span>
  )
}
