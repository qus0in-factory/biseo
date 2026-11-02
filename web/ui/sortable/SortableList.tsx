import type{ReactNode}from'react'
import{DndContext,closestCenter,type DragEndEvent}from'@dnd-kit/core'
import{SortableContext,horizontalListSortingStrategy,verticalListSortingStrategy}from'@dnd-kit/sortable'
import{sortableA11y}from'./sortableA11y'
import{useSortableSensors}from'./sortableSensors'
export function SortableList({ids,axis='vertical',onReorder,children}:{ids:string[];axis?:'vertical'|'horizontal';onReorder:(from:number,to:number)=>void;children:ReactNode}){
 const sensors=useSortableSensors()
 const end=({active,over}:DragEndEvent)=>{
  if(!over||active.id===over.id)return
  const from=ids.indexOf(String(active.id)),to=ids.indexOf(String(over.id))
  if(from>=0&&to>=0)onReorder(from,to)
 }
 return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={end} accessibility={sortableA11y}>
  <SortableContext items={ids} strategy={axis==='vertical'?verticalListSortingStrategy:horizontalListSortingStrategy}>
   {children}
  </SortableContext>
 </DndContext>
}
