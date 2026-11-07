import r from '../resources.json'

export function UsageReasonNote({ reason }: { reason?: string | null }) {
  if (!reason) return null
  if (reason === 'rate_limited') return <p className="text-sm text-muted-foreground">{r.usageReasonRateLimited}</p>
  const t = (r as Record<string, string>)[reason] ?? r.usageReasonUnknown
  return <p className="text-sm text-muted-foreground">{t}</p>
}
