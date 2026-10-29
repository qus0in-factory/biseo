import type { ReactNode } from 'react'

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto my-0 w-full max-w-[960px] min-w-0 overflow-hidden rounded-lg border border-border bg-card p-3 sm:p-6">
      {children}
    </main>
  )
}
