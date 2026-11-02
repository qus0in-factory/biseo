import type { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
type S=ReturnType<typeof useSortable>
export type SortableState={ref:S['setNodeRef'];style:CSSProperties;attributes:S['attributes'];listeners:S['listeners'];dragging:boolean}
export function SortableItem({id,children}:{id:string;children:(s:SortableState)=>ReactNode}){
 const {setNodeRef,transform,transition,isDragging,attributes,listeners}=useSortable({id})
 const style:CSSProperties={
  transform:transform?`translate3d(${transform.x}px,${transform.y}px,0)`:undefined,
  transition,opacity:isDragging?0.6:1,zIndex:isDragging?2:undefined,
 }
 return <>{children({ref:setNodeRef,style,attributes,listeners,dragging:isDragging})}</>
}
