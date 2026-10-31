import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './button'
import r from '../../resources.json'
type P = {title?: string; onClose: () => void; actions?: ReactNode}
export function SheetHeader({title, onClose, actions}: P) {
 return <div className="flex items-center justify-between border-b border-border pb-3">
  {title && <h2 id="sheet-title" className="text-base font-semibold">{title}</h2>}
  <div className="flex gap-1">
   <Button type="button" variant="outline" size="icon" aria-label={r.close}
    title={r.close} onClick={onClose}><X size={20} aria-hidden="true"/></Button>
   {actions}
  </div>
 </div>
}
