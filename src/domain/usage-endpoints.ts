import type { UsageEndpoints } from './usage-endpoints-types.js'
import { getBaseEndpoints } from './usage-endpoints-base.js'
import { getOllamaEndpoints } from './usage-endpoints-ollama.js'
import { getAgyEndpoints } from './usage-endpoints-agy.js'
import { getUsageTimeoutMs } from './usage-endpoints-timeout.js'
export type { UsageEndpoints }
export const getUsageEndpoints = (): UsageEndpoints => ({
  ...getBaseEndpoints(),
  ...getOllamaEndpoints(),
  ...getAgyEndpoints()
})
export { getUsageTimeoutMs }
