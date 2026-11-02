import type { ReactNode } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { sortableA11y } from './sortableA11y'
import { useSortableSensors } from './sortableSensors'
import { getSortableStrategy } from './sortableStrategy'
import { useSortableList } from './useSortableList'

type P = { ids: string[]; axis?: 'vertical' | 'horizontal'; onReorder: (f: number, t: number) => void; children: ReactNode }

export function SortableList({ ids, axis = 'vertical', onReorder, children }: P) {
  const sensors = useSortableSensors()
  const { items, start, stop, end } = useSortableList(ids, onReorder)
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={start} onDragEnd={end} onDragCancel={stop} accessibility={sortableA11y}>
      <SortableContext items={items} strategy={getSortableStrategy(axis)}>{children}</SortableContext>
    </DndContext>
  )
}
