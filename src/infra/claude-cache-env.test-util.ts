import { setLastClaudeSnapshot as set } from './claude-snapshot-store.js'

export const withCacheEnv = async (fn: () => Promise<void>): Promise<void> => {
  const u = process.env.BISEO_CLAUDE_USAGE_URL
  const t = process.env.BISEO_CLAUDE_CACHE_TTL_MS
  process.env.BISEO_CLAUDE_USAGE_URL = 'http://127.0.0.1:1/invalid'
  process.env.BISEO_CLAUDE_CACHE_TTL_MS = '3600000'
  set(null)
  try {
    await fn()
  } finally {
    if (u === undefined) delete process.env.BISEO_CLAUDE_USAGE_URL
    else process.env.BISEO_CLAUDE_USAGE_URL = u
    if (t === undefined) delete process.env.BISEO_CLAUDE_CACHE_TTL_MS
    else process.env.BISEO_CLAUDE_CACHE_TTL_MS = t
    set(null)
  }
}
