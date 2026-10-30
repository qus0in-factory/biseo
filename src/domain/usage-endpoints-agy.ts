import type { UsageEndpoints } from './usage-endpoints-types.js'
const e = process.env
export const getAgyEndpoints = (): Pick<UsageEndpoints, 'agy'> => ({
  agy: e.BISEO_AGY_USAGE_URL ?? 'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary'
})
