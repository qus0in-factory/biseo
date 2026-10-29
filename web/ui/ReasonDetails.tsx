import { AlertCircle } from 'lucide-react'
import r from '../resources.json'

export function ReasonDetails({ text }: { text: string }) {
  if (!text) return null
  return (
    <details className="relative inline-flex shrink-0 items-center">
      <summary aria-label={r.reasonLabel} title={text} className="inline-flex cursor-pointer list-none items-center justify-center pr-[31px] -mr-[31px] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <AlertCircle size={13} aria-hidden="true" className="block shrink-0" />
      </summary>
      <div className="absolute top-full left-0 z-10 w-max max-w-60 wrap-anywhere rounded-sm border border-border bg-card px-2 py-1 text-xs text-foreground shadow" role="tooltip">
        {text}
      </div>
    </details>
  )
}
