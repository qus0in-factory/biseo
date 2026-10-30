import { Button } from '../components/ui/button'
import r from '../resources.json'

export function AsyncFallback({
  errorText,
  onRetry,
  inline = false,
}: {
  errorText: string
  onRetry?: () => void
  inline?: boolean
}) {
  return (
    <div className={inline ? 'flex items-center gap-2 text-xs text-error' : 'flex flex-col items-start gap-2 text-sm text-error'}>
      <span>{errorText}</span>
      {onRetry && <Button type="button" variant="ghost" onClick={onRetry}>{r.retry}</Button>}
    </div>
  )
}
