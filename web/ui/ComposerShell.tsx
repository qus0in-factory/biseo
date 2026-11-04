import type { ReactNode, FormEvent, CSSProperties } from 'react'

export function ComposerShell({ onSubmit, children, style }: { onSubmit: () => void; children: ReactNode; style?: CSSProperties }) {
  const submitForm = (e: FormEvent) => { e.preventDefault(); onSubmit() }
  return (
    <form
      className="sticky bottom-0 z-10 flex flex-col bg-background pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      style={{ top: 'var(--visual-viewport-offset-top, 0px)', ...style }}
      onSubmit={submitForm}
    >
      {children}
    </form>
  )
}
