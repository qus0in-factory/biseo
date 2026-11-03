import type { ReactNode } from 'react'

export function ComposerCapsule({ children }: { children: ReactNode }) {
  return (
    <div className="box-border flex w-full flex-row flex-nowrap items-end gap-2 rounded-2xl border border-border bg-card p-1.5 sm:p-2">
      {children}
    </div>
  )
}
