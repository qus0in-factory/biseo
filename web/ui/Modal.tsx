import type{ReactNode}from'react'
import{ModalBackdrop}from'./ModalBackdrop'
import{useSheetA11y}from'../components/ui/useSheetA11y'
import { ModalCloseButton } from './ModalCloseButton'
type P={open:boolean;title:string;onClose:()=>void;children:ReactNode;small?:boolean}
export function Modal({open,title,onClose,children,small}:P){
 const ref=useSheetA11y(open,onClose)
 if(!open)return null
 return(
  <ModalBackdrop onClose={onClose}>
   <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`relative z-50 flex max-h-[80vh] w-full ${small ? 'max-w-sm' : 'max-w-2xl'} flex-col rounded-lg bg-card p-4`}>
    <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
     <h2 className="text-base font-semibold">{title}</h2>
     <ModalCloseButton onClose={onClose}/>
    </div>
    <div className="min-w-0 overflow-y-auto overflow-x-hidden">{children}</div>
   </div>
  </ModalBackdrop>
 )
}
