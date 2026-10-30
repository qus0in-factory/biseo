export type UsageEndpoints = Record<'codex'|'claude'|'opencodeGo'|'opencodeFree'|'grok'|'grokRefresh'|'ollama'|'agy', string>

const e = process.env
export const getUsageEndpoints = (): UsageEndpoints => ({
  codex: e.BISEO_CODEX_USAGE_URL ?? 'https://chatgpt.com/backend-api/wham/usage',
  claude: e.BISEO_CLAUDE_USAGE_URL ?? 'https://api.anthropic.com/api/oauth/usage',
  opencodeGo: e.BISEO_OPENCODE_GO_USAGE_URL ?? 'https://opencode.ai/zen/go/v1/usage',
  opencodeFree: e.BISEO_OPENCODE_FREE_URL ?? 'https://opencode.ai/zen/v1/chat/completions',
  grok: e.BISEO_GROK_BILLING_URL ?? 'https://cli-chat-proxy.grok.com/v1/billing?format=credits',
  grokRefresh: e.BISEO_GROK_REFRESH_URL ?? 'https://auth.x.ai/oauth2/token',
  ollama: e.BISEO_OLLAMA_BALANCE_URL ?? 'http://127.0.0.1:11434/api/balance',
  agy: e.BISEO_AGY_USAGE_URL ?? 'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary'
})

export const getUsageTimeoutMs = (): number => Number(e.BISEO_USAGE_TIMEOUT_MS ?? 5000)
