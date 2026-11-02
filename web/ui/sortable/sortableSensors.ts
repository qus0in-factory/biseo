import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
export const longPress = { delay: 350, tolerance: 8 }
export const useSortableSensors = () =>
  useSensors(
    useSensor(MouseSensor, { activationConstraint: longPress }),
    useSensor(TouchSensor, { activationConstraint: longPress }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
