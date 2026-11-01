import type { UsageReport } from '../domain/usage-types.js'
import { safeFetch } from './usage-safe-fetch.js'
import { fetchCodexUsage as cx } from './codex-wham-fetch.js'
import { fetchClaudeUsage as cl } from './claude-oauth-fetch.js'
import { fetchOpencodeGoUsage as og } from './opencode-go-fetch.js'
import { fetchGrokUsage as gk } from './grok-billing-fetch.js'
import { fetchOllamaUsage as ol } from './ollama-usage-fetch.js'
import { fetchAgyUsage as ag } from './agy-usage-fetch.js'

export class UsageCollector {
  async getReport(now = new Date()): Promise<UsageReport> {
    const providers = await Promise.all([
      safeFetch('codex', cx, now), safeFetch('claude', cl, now),
      safeFetch('opencode-go', og, now),
      safeFetch('grok', gk, now), safeFetch('ollama', ol, now),
      safeFetch('agy', ag, now)
    ])
    return { providers, updatedAt: now.toISOString() }
  }
}
