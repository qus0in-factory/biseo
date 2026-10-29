import type { ReactNode, FormEvent } from 'react'

export function ComposerShell({ onSubmit, children }: { onSubmit: (e: FormEvent) => void; children: ReactNode }) {
  return (
    <form
      className="sticky bottom-0 z-10 flex flex-col bg-background pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}
