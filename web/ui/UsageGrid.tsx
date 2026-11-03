import type { ReactNode } from 'react'

export function UsageGrid({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 grid-cols-1 items-start gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div>
}
