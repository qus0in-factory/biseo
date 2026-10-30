import type { ReactNode } from 'react'

export function ModalBackdrop({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      {children}
    </div>
  )
}
