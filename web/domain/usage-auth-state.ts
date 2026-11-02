import type { UsageProvider } from './usage'

export function isAuthRequired(p: UsageProvider): boolean {
  return p.reason === 'auth_required' || p.reason === 'auth_failed' || p.reason === 'agy_auth_expired'
}

export function isStaleProvider(p: UsageProvider): boolean {
  return isAuthRequired(p) || (p.windows ?? []).some((w) => w.source?.endsWith('-stale') || w.source === 'claude-cache')
}

export function isResetPassed(resetsAt: string | null | undefined, now = Date.now()): boolean {
  if (!resetsAt) return false
  const t = Date.parse(resetsAt)
  return Number.isFinite(t) && t <= now
}

export function getReauthPrompt(provider: string, res: Record<string, string>): string {
  return res[`usageReauth_${provider}`] ?? res.usageReauth_default ?? res.auth_required
}

export function getLastCheckedAt(p: UsageProvider): string | null {
  const win = (p.windows ?? []).find((w) => w.checkedAt)
  return win?.checkedAt ?? (p as { checkedAt?: string | null }).checkedAt ?? null
}
