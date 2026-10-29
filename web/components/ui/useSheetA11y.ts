import { useEffect, useRef } from 'react'
import { trapTabKey } from './trapTabKey'

const Q = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useSheetA11y(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const prev = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    prev.current = document.activeElement as HTMLElement
    const el = ref.current
    const list = () => el?.querySelectorAll<HTMLElement>(Q)
    list()?.[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      trapTabKey(e, list())
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev.current?.focus()
    }
  }, [open, onClose])

  return ref
}
