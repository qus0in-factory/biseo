import type { ReactNode } from 'react'

export function ComposerCapsule({ children }: { children: ReactNode }) {
  return (
    <div className="box-border flex w-full flex-row flex-nowrap items-end gap-2 rounded-lg border border-border bg-white p-2">
      {children}
    </div>
  )
}
