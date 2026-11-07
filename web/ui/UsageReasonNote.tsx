import { usageReasonText } from '../domain/usage-note'

export function UsageReasonNote({ reason }: { reason?: string | null }) {
  const t = usageReasonText(reason)
  if (!t) return null
  return <p className="text-sm text-muted-foreground">{t}</p>
}
