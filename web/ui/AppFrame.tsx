import type { ReactNode } from 'react'

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto my-0 h-[calc(100svh-max(1rem,env(safe-area-inset-top))-1rem)] w-full min-h-0 min-w-0 flex flex-col overflow-hidden bg-card">
      {children}
    </main>
  )
}
