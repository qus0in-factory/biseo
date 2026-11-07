import { applyClaudeHttp as apply } from '../claude-oauth-apply.js'
import { resetClaudeBackoff as gate } from '../claude-oauth-backoff.js'
import { refreshClaudeUsage as poll, resetClaudeRefresh as clear } from '../claude-usage-refresh.js'

export async function claudeFail(status: number, at = new Date('2020-01-01T00:02:00Z')) {
  const t0 = new Date('2020-01-01T00:00:00Z')
  gate(); clear()
  apply(t0, 200, { five_hour: { utilization: 15, resets_at: '2020-01-01T00:01:00Z' } })
  await poll(at, async () => apply(at, status, null))
  return at
}
