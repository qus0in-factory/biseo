import { AlertTriangle, HelpCircle } from 'lucide-react'
import type { Availability } from '../domain/timeline'
import { availabilityNote, availabilityWhen } from '../domain/availability'
import r from '../resources.json'

const res = r as Record<string, string>

export function PaneAvailability({ availability }: { availability?: Availability }) {
  const note = availabilityNote(availability)
  if (!note) return null
  const limited = note.state === 'limited'
  const label = limited
    ? res.availabilityLimited.replace(
        '{at}',
        availabilityWhen(note.resetsAt, res.availabilityNoReset),
      )
    : res.availabilityUnknown
  const Icon = limited ? AlertTriangle : HelpCircle
  return (
    <span
      className={`pane-availability availability-${note.state}`}
      title={label}
      aria-label={label}
      role="img"
    >
      <Icon size={13} aria-hidden="true" />
    </span>
  )
}
