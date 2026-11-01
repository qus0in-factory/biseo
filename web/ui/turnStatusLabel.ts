import type { TurnStatus } from '../domain/timeline'

export const turnStatusLabel = (
  status: TurnStatus,
  errorCode: string | null | undefined,
  res: Record<string, string>,
) =>
  status === 'failed' && (errorCode === 'delivery_uncertain' || errorCode === 'target_unclear')
    ? res[errorCode]
    : status === 'timeout' && errorCode === 'late_capture_expired'
    ? (res.lateCaptureClosed ?? status)
    : (res[`turn_${status}`] ?? status)
