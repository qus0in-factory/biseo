import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { useSheetA11y } from '../components/ui/useSheetA11y'
import { ModalBackdrop } from './ModalBackdrop'
import r from '../resources.json'

export function WorkspaceSwitchingOverlay() {
  const ref = useSheetA11y(true, () => {}, true)
  useEffect(() => {
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => { root?.removeAttribute('inert') }
  }, [])
  return createPortal(
    <ModalBackdrop onClose={() => {}}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={r.workspaceSwitching}
        className="flex items-center gap-2 rounded-lg bg-card p-4 text-sm shadow-lg focus-within:ring-2 focus-within:ring-ring">
        <div role="status" aria-busy="true" aria-live="polite" tabIndex={0}
          className="flex items-center gap-2 outline-none">
          <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
          <span>{r.workspaceSwitching}</span>
        </div>
      </div>
    </ModalBackdrop>,
    document.body,
  )
}