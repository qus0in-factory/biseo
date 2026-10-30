import type { ReactNode } from 'react'

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto my-0 h-[calc(100svh-max(1rem,env(safe-area-inset-top))-1rem)] w-full max-w-[960px] min-w-0 flex flex-col overflow-hidden rounded-lg border border-border bg-card p-3 sm:p-6">
      {children}
    </main>
  )
}
