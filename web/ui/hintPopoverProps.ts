type Ev = { stopPropagation: () => void }
type ClickEv = Ev & { preventDefault: () => void }

export const hintTriggerClass = (c = '') =>
  `pointer-events-auto relative inline-flex min-h-0 min-w-0 shrink-0 cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${c}`

export const stopHintEvent = (e: Ev) => e.stopPropagation()

export function hintTriggerEvents(
  open: boolean,
  setOpen: (v: boolean) => void,
) {
  return {
    onPointerDown: stopHintEvent,
    onMouseDown: stopHintEvent,
    onTouchStart: stopHintEvent,
    onKeyDown: stopHintEvent,
    onClick: (e: ClickEv) => {
      stopHintEvent(e)
      e.preventDefault()
      setOpen(!open)
    },
  }
}
