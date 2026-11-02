import { horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'

export const getSortableStrategy = (axis: 'vertical' | 'horizontal') =>
  axis === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy
