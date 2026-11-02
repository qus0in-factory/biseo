import type { UsageProvider } from '../domain/usage'
import { getReauthPrompt, getLastCheckedAt } from '../domain/usage-auth-state.js'
import { formatZoned } from '../domain/formatZoned.js'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageAuthNotice({ provider }: { provider: UsageProvider }) {
  const checkedAt = getLastCheckedAt(provider)
  return (
    <>
      <p className="text-xs font-medium text-error">{getReauthPrompt(provider.provider, res)}</p>
      {checkedAt && (
        <p className="text-xs text-muted-foreground">
          {res.usageLastSuccess} {formatZoned(checkedAt, 'Asia/Seoul')}
        </p>
      )}
    </>
  )
}
