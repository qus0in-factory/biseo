import type { ReactNode } from 'react'

export function SheetBackdrop({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none"
        onClick={onClick}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
