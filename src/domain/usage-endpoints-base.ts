import type { UsageEndpoints } from './usage-endpoints-types.js'
const e = process.env
export const getBaseEndpoints = (): Pick<UsageEndpoints, 'codex'|'claude'|'opencodeGo'|'opencodeFree'|'grok'|'grokRefresh'> => ({
  codex: e.BISEO_CODEX_USAGE_URL ?? 'https://chatgpt.com/backend-api/wham/usage',
  claude: e.BISEO_CLAUDE_USAGE_URL ?? 'https://api.anthropic.com/api/oauth/usage',
  opencodeGo: e.BISEO_OPENCODE_GO_USAGE_URL ?? 'https://opencode.ai/zen/go/v1/usage',
  opencodeFree: e.BISEO_OPENCODE_FREE_URL ?? 'https://opencode.ai/zen/v1/chat/completions',
  grok: e.BISEO_GROK_BILLING_URL ?? 'https://cli-chat-proxy.grok.com/v1/billing?format=credits',
  grokRefresh: e.BISEO_GROK_REFRESH_URL ?? 'https://auth.x.ai/oauth2/token'
})
