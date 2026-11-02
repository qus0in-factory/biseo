import type { RefObject } from 'react'
import { useEffect } from 'react'

export function usePopoverDismiss(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return
    const md = (e: PointerEvent) => {
      if (e.target instanceof Node && !ref.current?.contains(e.target)) onClose()
    }
    const kd = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', md, true)
    document.addEventListener('keydown', kd, true)
    return () => {
      document.removeEventListener('pointerdown', md, true)
      document.removeEventListener('keydown', kd, true)
    }
  }, [open, ref, onClose])
}
