import type { UsageEndpoints } from './usage-endpoints-types.js'
const e = process.env
export const getOllamaEndpoints = (): Pick<UsageEndpoints, 'ollama'|'ollamaCloudUsage'|'ollamaCloudBalance'> => ({
  ollama: e.BISEO_OLLAMA_BALANCE_URL ?? 'http://127.0.0.1:11434/api/balance',
  ollamaCloudUsage: e.BISEO_OLLAMA_CLOUD_USAGE_URL ?? 'https://ollama.com/api/usage',
  ollamaCloudBalance: e.BISEO_OLLAMA_CLOUD_BALANCE_URL ?? 'https://ollama.com/api/balance'
})
