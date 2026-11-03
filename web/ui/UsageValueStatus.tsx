import { AlertTriangle } from 'lucide-react'
import { normalizeWarningWindow } from '../domain/usage-window-norm'
import { DEFAULT_USAGE_WARNING_CONFIG as config } from '../domain/usage-warning'
import r from '../resources.json'

export function UsageValueStatus({ text, used, window, limited = false }: {
  text: string; used: number | null; window: string; limited?: boolean
}) {
  const kind = normalizeWarningWindow(window.split(':').pop()!)
  const threshold = kind === '5h' ? config.fiveHour : kind === 'w' ? config.weekly : config.monthly
  const danger = limited || (used !== null && used >= 100)
  const warning = kind && used !== null && used >= threshold
  const label = danger ? r.usage_limited : warning ? r.usageWarningPrefix : null
  return (
    <span className={`inline-flex max-w-full items-center gap-1 ${danger ? 'text-danger' : warning ? 'text-warning' : ''}`}>
      {label && <><AlertTriangle size={12} className="shrink-0" aria-hidden="true" /><span className="sr-only">{label}</span></>}
      <span className="truncate" title={text}>{text}</span>
    </span>
  )
}
