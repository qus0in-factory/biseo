import type { ReactNode } from 'react'

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto my-0 max-w-[960px] rounded-lg border border-border bg-card p-6">
      {children}
    </main>
  )
}
