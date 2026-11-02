import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import { hintTriggerClass, hintTriggerEvents, stopHintEvent } from './hintPopoverProps'
import { usePopoverDismiss } from './usePopoverDismiss'

type P = { label: string; text?: string; className?: string; children: ReactNode }

export function HintPopover(p: P) {
  const [o, s] = useState(false)
  const r = useRef<HTMLButtonElement>(null)
  usePopoverDismiss(o, r, () => s(false))
  const c = hintTriggerClass(p.className), e = hintTriggerEvents(o, s)
  return (
    <Tooltip open={o}>
      <TooltipTrigger asChild>
        <button ref={r} type="button" aria-label={p.label} aria-expanded={o} {...e} className={c}>{p.children}</button>
      </TooltipTrigger>
      <TooltipContent onPointerDown={stopHintEvent} onClick={stopHintEvent}>{p.text ?? p.label}</TooltipContent>
    </Tooltip>
  )
}
