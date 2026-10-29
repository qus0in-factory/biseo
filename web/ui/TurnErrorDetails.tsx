import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

export function TurnErrorDetails({ code }: { code?: string | null }) {
  if (!code) return null
  const txt = code === 'delivery_uncertain' ? r.uncertainDelivery : code
  return <ReasonDetails text={txt} />
}
