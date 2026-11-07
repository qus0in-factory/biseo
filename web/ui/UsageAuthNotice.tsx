import type { UsageProvider } from '../domain/usage'
import { getReauthPrompt, getLastCheckedAt, isAuthRequired } from '../domain/usage-auth-state.js'
import { formatZoned } from '../domain/formatZoned.js'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageAuthNotice({ provider }: { provider: UsageProvider }) {
  const checkedAt = getLastCheckedAt(provider)
  return (
    <>
      <p className="text-sm font-medium text-danger">{isAuthRequired(provider)
        ? getReauthPrompt(provider.provider, res) : res[provider.reason!]}</p>
      {checkedAt && (
        <p className="text-sm text-muted-foreground">
          {res.usageLastSuccess} {formatZoned(checkedAt, 'Asia/Seoul')}
        </p>
      )}
    </>
  )
}
