import { Loader2 } from 'lucide-react'
import r from '../resources.json'

export function AsyncRefreshing() {
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <Loader2 size={12} className="motion-safe:animate-spin" aria-hidden="true" />
      {r.loading}
    </p>
  )
}
