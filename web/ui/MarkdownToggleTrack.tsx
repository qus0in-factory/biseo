import type { ReactNode } from 'react'

export function MarkdownToggleTrack({ on, left, right }: { on: boolean; left: ReactNode; right: ReactNode }) {
  return (
    <span aria-hidden="true" className="flex h-7 w-16 items-stretch overflow-hidden rounded border border-border bg-surface">
      <span className={`flex flex-1 items-center justify-center ${on ? 'bg-surface text-muted-foreground' : 'bg-card text-foreground'}`}>{left}</span>
      <span className={`flex flex-1 items-center justify-center ${on ? 'bg-card text-foreground' : 'bg-surface text-muted-foreground'}`}>{right}</span>
    </span>
  )
}