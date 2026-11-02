import { AlertCircle } from 'lucide-react'
import { HintPopover } from './HintPopover'
import r from '../resources.json'

export function ReasonDetails({ text }: { text: string }) {
  if (!text) return null
  return (
    <HintPopover label={r.reasonLabel} text={text} className="pr-[31px] -mr-[31px] text-muted-foreground hover:text-foreground">
      <AlertCircle size={13} aria-hidden="true" className="block shrink-0" />
    </HintPopover>
  )
}
