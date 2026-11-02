export type AvailabilityState = 'available' | 'limited' | 'unknown'
export type AvailabilityWindow = 'primary' | 'secondary'
export interface Availability {
  state: AvailabilityState
  source: string | null
  checkedAt: string | null
  resetsAt: string | null
  reason: string | null
  window: AvailabilityWindow | null
}

export interface AvailabilityNote {
  state: 'limited'
  resetsAt: string | null
}

export function availabilityNote(
  availability?: Availability,
): AvailabilityNote | null {
  if (!availability || availability.state !== 'limited') return null
  return {
    state: 'limited',
    resetsAt: availability.resetsAt,
  }
}

export function availabilityWhen(at: string | null, fallback: string) {
  if (!at) return fallback
  const d = new Date(at)
  if (Number.isNaN(d.getTime())) return fallback
  return `${d.toISOString().replace('T', ' ').slice(0, 16)}Z`
}
