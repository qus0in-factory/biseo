import { useEffect, useRef } from 'react'
import { trapTabKey } from './trapTabKey'

const Q =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useSheetA11y(open: boolean, onClose: () => void, deferFocusRestore = false) {
  const ref = useRef<HTMLDivElement>(null)
  const prev = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    prev.current = document.activeElement as HTMLElement
    const el = ref.current
    const list = () => el?.querySelectorAll<HTMLElement>(Q)
    list()?.[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      const dialogs = document.querySelectorAll('[aria-modal="true"]')
      if (dialogs.length && el?.closest('[aria-modal="true"]') !== dialogs[dialogs.length - 1]) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      trapTabKey(e, list())
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (deferFocusRestore) setTimeout(() => prev.current?.focus(), 0)
      else prev.current?.focus()
    }
  }, [open, deferFocusRestore])

  return ref
}
