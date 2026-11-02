import type { Announcements } from '@dnd-kit/core'
import r from '../../resources.json'
const fill=(text:string,values:Record<string,string>)=>
 Object.entries(values).reduce((out,[key,value])=>out.replaceAll(`{${key}}`,value),text)
const pos=(x:{data:{current?:{sortable?:{index:number}}}})=>String((x.data.current?.sortable?.index??0)+1)
export const sortableAnnouncements:Announcements={
 onDragStart:({active})=>fill(r.sortablePickedUp,{index:pos(active)}),
 onDragOver:({over})=>over?fill(r.sortableMoved,{index:pos(over)}):undefined,
 onDragEnd:({over})=>over?fill(r.sortableDropped,{index:pos(over)}):undefined,
 onDragCancel:()=>r.sortableCanceled,
}
export const sortableA11y={
 announcements:sortableAnnouncements,
 screenReaderInstructions:{draggable:r.sortableInstructions},
}
