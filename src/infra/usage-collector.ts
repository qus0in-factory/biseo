import type { ProviderUsage, UsageReport } from '../domain/usage-types.js'
import { fetchCodexUsage } from './codex-wham-fetch.js'
import { fetchClaudeUsage } from './claude-oauth-fetch.js'
import { fetchOpencodeGoUsage } from './opencode-go-fetch.js'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'
import { fetchAgyUsage } from './agy-usage-fetch.js'

export class UsageCollector {
  async getReport(now = new Date()): Promise<UsageReport> {
    const list = await Promise.all([
      fetchCodexUsage(now),
      fetchClaudeUsage(now),
      fetchOpencodeGoUsage(now),
      fetchGrokUsage(now),
      fetchOllamaUsage(now),
      fetchAgyUsage(now)
    ])
    return {
      providers: list,
      updatedAt: now.toISOString()
    }
  }
}
