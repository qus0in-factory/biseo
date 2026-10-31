import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { Button } from '../components/ui/button'
import type { ComponentProps } from 'react'
type P = ComponentProps<typeof Button> & {icon: LucideIcon; busy?: boolean; danger?: boolean}
export function SettingsAction({icon: Icon, busy, danger, children, ...props}: P) {
 return <Button variant="outline" {...props} disabled={props.disabled || busy} aria-busy={busy}
  className={danger ? 'border-error text-error' : undefined}>
  {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true"/> :
   <Icon size={16} aria-hidden="true"/>}{children}
 </Button>
}
