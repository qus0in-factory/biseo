import type { ReactNode } from 'react'

export function UsageGrid({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 columns-1 gap-3 md:columns-2 xl:columns-3 [column-fill:balance] [&>*]:mb-3 [&>*]:break-inside-avoid">
      {children}
    </div>
  )
}
