import { ReasonIcon } from './ComposerIcons'
import { HintPopover } from './HintPopover'

export function ReasonTip({ text }: { text: string }) {
  return (
    <HintPopover label={text} className="h-6 min-h-6 w-6 cursor-help text-muted-foreground before:absolute before:-inset-2.5 before:content-['']">
      <ReasonIcon title={text} />
    </HintPopover>
  )
}
