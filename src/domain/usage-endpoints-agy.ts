import type { UsageEndpoints } from './usage-endpoints-types.js'
const e = process.env
const host = () => (e.BISEO_AGY_HOST ?? 'https://daily-cloudcode-pa.googleapis.com').replace(/\/+$/, '')
export const getAgyEndpoints = (): Pick<UsageEndpoints, 'agy' | 'agyQuota' | 'agyToken'> => ({
  agy: e.BISEO_AGY_USAGE_URL ?? `${host()}/v1internal:retrieveUserQuotaSummary`,
  agyQuota: e.BISEO_AGY_QUOTA_URL ?? `${host()}/v1internal:retrieveUserQuota`,
  agyToken: e.BISEO_AGY_TOKEN_URL ?? 'https://oauth2.googleapis.com/token'
})
