import { SendIcon } from './ComposerIcons'
import { Button } from '../components/ui/button'

export function SendRoundButton({ label, can }: { label: string; can: boolean }) {
  return (
    <Button
      className="h-11 w-11 shrink-0 rounded-full bg-primary p-0 text-primary-foreground hover:text-primary-foreground disabled:opacity-35"
      type="submit"
      size="icon"
      disabled={!can}
      aria-label={label}
      title={label}
    >
      <SendIcon />
    </Button>
  )
}
