import { AlertTriangle } from 'lucide-react'
import { usageValueTone } from './usageValueTone'
import r from '../resources.json'

export function UsageValueStatus({ text, used, window, limited = false }: {
  text: string; used: number | null; window: string; limited?: boolean
}) {
  const tone = usageValueTone(used, window, limited)
  const danger = tone === 'danger', warning = tone === 'warning'
  const label = danger ? r.usage_limited : warning ? r.usageWarningPrefix : null
  return (
    <span className={`inline-flex max-w-full items-center gap-1 ${danger ? 'text-danger' : warning ? 'text-warning' : ''}`}>
      {label && <><AlertTriangle size={12} className="shrink-0" aria-hidden="true" /><span className="sr-only">{label}</span></>}
      <span className="truncate" title={text}>{text}</span>
    </span>
  )
}
