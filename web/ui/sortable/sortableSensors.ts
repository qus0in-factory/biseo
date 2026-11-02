import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

export const mouseConstraint = { distance: 8 }
export const touchConstraint = { delay: 250, tolerance: 10 }
const mouseCfg = { activationConstraint: mouseConstraint }
const touchCfg = { activationConstraint: touchConstraint }
const keyCfg = { coordinateGetter: sortableKeyboardCoordinates }

export const useSortableSensors = () =>
  useSensors(
    useSensor(MouseSensor, mouseCfg),
    useSensor(TouchSensor, touchCfg),
    useSensor(KeyboardSensor, keyCfg),
  )
