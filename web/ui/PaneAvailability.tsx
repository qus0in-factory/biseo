import { AlertTriangle } from 'lucide-react'
import type { Availability } from '../domain/timeline'
import { availabilityNote, availabilityWhen } from '../domain/availability'
import { HintPopover } from './HintPopover'
import r from '../resources.json'

export function PaneAvailability({ availability }: { availability?: Availability }) {
  const note = availabilityNote(availability)
  if (!note) return null
  const label = r.availabilityLimited.replace(
    '{at}',
    availabilityWhen(note.resetsAt, r.availabilityNoReset),
  )
  return (
    <HintPopover label={label} className="text-muted-foreground hover:text-foreground">
      <span role="status" className="inline-flex shrink-0 items-center">
        <AlertTriangle size={13} aria-hidden="true" className="block shrink-0" />
      </span>
    </HintPopover>
  )
}
