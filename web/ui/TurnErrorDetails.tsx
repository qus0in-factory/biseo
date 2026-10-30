import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

const res = r as Record<string, string>

export function TurnErrorDetails({ code }: { code?: string | null }) {
  if (!code || code === 'turn_timeout' || code === 'late_capture_expired') return null
  const txt = code === 'delivery_uncertain'
    ? res.uncertainDelivery
    : (res[code] ?? code)
  return <ReasonDetails text={txt} />
}
