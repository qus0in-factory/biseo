import { AlertCircle } from 'lucide-react'
import r from '../resources.json'

export function ReasonDetails({ text }: { text: string }) {
  if (!text) return null
  return (
    <details className="reason-details">
      <summary aria-label={r.reasonLabel} title={text}>
        <AlertCircle size={13} aria-hidden="true" />
      </summary>
      <div className="reason-popover" role="tooltip">
        {text}
      </div>
    </details>
  )
}
