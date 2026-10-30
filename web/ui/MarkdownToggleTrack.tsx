import type { ReactNode } from 'react'

export function MarkdownToggleTrack({ on, left, right }: { on: boolean; left: ReactNode; right: ReactNode }) {
  return (
    <span aria-hidden="true" className="relative flex h-7 w-16 items-center justify-between rounded-full border border-border bg-surface px-1">
      {left}
      {right}
      <span className={`absolute left-1 top-1 h-5 w-5 rounded-full border border-border bg-card shadow-sm transition-transform ${on ? 'translate-x-9' : ''}`} />
    </span>
  )
}