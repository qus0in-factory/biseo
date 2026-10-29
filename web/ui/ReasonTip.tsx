import { useRef, useState } from 'react'
import { ReasonIcon } from './ComposerIcons'
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'
import { nextOpen } from './reasonTipToggle'

export function ReasonTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const down = useRef<boolean|null>(null)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button type="button" aria-label={text} aria-expanded={open} onPointerDown={() => { down.current = open }} onClick={(e) => { e.preventDefault(); const w = down.current; down.current = null; const n = nextOpen(open,w); if (n !== null) setOpen(n) }} className="relative inline-flex h-6 min-h-6 w-6 shrink-0 cursor-help items-center justify-center text-muted-foreground before:absolute before:-inset-2.5 before:content-['']">
          <ReasonIcon title={text} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
