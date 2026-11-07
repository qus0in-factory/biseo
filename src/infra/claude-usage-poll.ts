import { claudeBackoffCfg } from './claude-oauth-config.js'
import { refreshClaudeUsage } from './claude-usage-refresh.js'

export function startClaudeUsagePoll(now = () => new Date()): () => void {
  const tick = () => { void refreshClaudeUsage(now()) }
  const id = setInterval(tick, claudeBackoffCfg().initialMs)
  id.unref()
  tick()
  return () => clearInterval(id)
}
