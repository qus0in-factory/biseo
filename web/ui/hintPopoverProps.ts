import type { MutableRefObject } from 'react'
import { nextOpen } from './reasonTipToggle'

type Ev = { stopPropagation: () => void }
type ClickEv = Ev & { preventDefault: () => void }

export const hintTriggerClass = (c = '') =>
  `relative inline-flex shrink-0 cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${c}`

export const stopHintEvent = (e: Ev) => e.stopPropagation()

export function hintTriggerEvents(
  open: boolean,
  down: MutableRefObject<boolean | null>,
  setOpen: (v: boolean) => void,
) {
  return {
    onPointerDown: (e: Ev) => { stopHintEvent(e); down.current = open },
    onMouseDown: stopHintEvent,
    onTouchStart: stopHintEvent,
    onKeyDown: stopHintEvent,
    onClick: (e: ClickEv) => {
      stopHintEvent(e)
      e.preventDefault()
      const n = nextOpen(open, down.current)
      down.current = null
      if (n !== null) setOpen(n)
    },
  }
}
