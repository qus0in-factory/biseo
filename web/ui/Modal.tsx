import type{ReactNode}from'react'
import{X}from'lucide-react'
import{ModalBackdrop}from'./ModalBackdrop'
import{useSheetA11y}from'../components/ui/useSheetA11y'
import{Button}from'../components/ui/button'
import r from'../resources.json'
type P={open:boolean;title:string;onClose:()=>void;children:ReactNode}
export function Modal({open,title,onClose,children}:P){
 const ref=useSheetA11y(open,onClose)
 if(!open)return null
 return(
  <ModalBackdrop onClose={onClose}>
   <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="relative z-50 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-card p-4">
    <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
     <h2 className="text-base font-semibold">{title}</h2>
     <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={r.close}><X size={18} aria-hidden="true"/></Button>
    </div>
    <div className="overflow-y-auto">{children}</div>
   </div>
  </ModalBackdrop>
 )
}