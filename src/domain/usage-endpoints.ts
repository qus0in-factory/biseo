export interface UsageEndpoints {
  codex: string
  claude: string
  opencodeGo: string
  opencodeFree: string
  grok: string
  ollama: string
  agy: string
}

export const getUsageEndpoints = (): UsageEndpoints => ({
  codex: process.env.BISEO_CODEX_USAGE_URL ?? 'https://chatgpt.com/backend-api/wham/usage',
  claude: process.env.BISEO_CLAUDE_USAGE_URL ?? 'https://api.anthropic.com/api/oauth/usage',
  opencodeGo: process.env.BISEO_OPENCODE_GO_USAGE_URL ?? 'https://opencode.ai/zen/go/v1/usage',
  opencodeFree: process.env.BISEO_OPENCODE_FREE_URL ?? 'https://opencode.ai/zen/v1/chat/completions',
  grok: process.env.BISEO_GROK_BILLING_URL ?? 'https://cli-chat-proxy.grok.com/v1/billing?format=credits',
  ollama: process.env.BISEO_OLLAMA_TAGS_URL ?? 'http://localhost:11434/api/tags',
  agy: process.env.BISEO_AGY_USAGE_URL ?? 'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary'
})

export const getUsageTimeoutMs = (): number => Number(process.env.BISEO_USAGE_TIMEOUT_MS ?? 5000)
