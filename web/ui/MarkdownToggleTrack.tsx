import type { ReactNode } from 'react'
import { toggleSegmentStyle } from './toggleSegmentStyle'

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
      <span className={`flex flex-1 items-center justify-center ${toggleSegmentStyle(!on)}`}>{left}</span>
      <span className={`flex flex-1 items-center justify-center ${toggleSegmentStyle(on)}`}>{right}</span>
    </span>
  )
}
