import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { Button } from '../components/ui/button'
import type { ComponentProps } from 'react'
type P = ComponentProps<typeof Button> & {icon: LucideIcon; busy?: boolean; danger?: boolean; iconOnly?: boolean}
export function SettingsAction({icon: Icon, busy, danger, iconOnly, children, ...props}: P) {
 return <Button variant="ghost" {...props} disabled={props.disabled || busy} aria-busy={busy}
  aria-label={iconOnly ? String(children) : undefined} title={iconOnly ? String(children) : undefined}
  className={danger ? 'text-error hover:text-error' : undefined}>
  {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true"/> :
   <Icon size={16} aria-hidden="true"/>}{!iconOnly && children}
 </Button>
}
