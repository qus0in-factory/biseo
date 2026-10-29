export type AvailabilityState = 'available' | 'limited' | 'unknown'
export type AvailabilityWindow = 'primary' | 'secondary'
export interface Availability {
  state: AvailabilityState
  source: string | null
  checkedAt: string
  resetsAt: string | null
  reason: string | null
  window: AvailabilityWindow | null
}

export interface AvailabilityNote {
  state: 'limited' | 'unknown'
  resetsAt: string | null
}

export function availabilityNote(
  availability?: Availability,
): AvailabilityNote | null {
  if (!availability || availability.state === 'available') return null
  return {
    state: availability.state,
    resetsAt: availability.state === 'limited' ? availability.resetsAt : null,
  }
}

export function availabilityWhen(at: string | null, fallback: string) {
  if (!at) return fallback
  const d = new Date(at)
  if (Number.isNaN(d.getTime())) return fallback
  return `${d.toISOString().replace('T', ' ').slice(0, 16)}Z`
}
