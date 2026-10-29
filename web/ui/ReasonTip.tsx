import { ReasonIcon } from './ComposerIcons'
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'

export function ReasonTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative inline-flex h-6 w-6 shrink-0 cursor-help items-center justify-center text-muted-foreground before:absolute before:-inset-2.5 before:content-['']">
          <ReasonIcon title={text} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
