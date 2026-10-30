import r from '../resources.json'

export function UsageReasonNote({ reason }: { reason?: string | null }) {
  if (!reason) return null
  const t = (r as Record<string, string>)[reason] ?? reason
  return <p className="text-xs text-muted-foreground">{t}</p>
}
