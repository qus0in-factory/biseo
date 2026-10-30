const e = process.env
export const getUsageTimeoutMs = (): number => Number(e.BISEO_USAGE_TIMEOUT_MS ?? 5000)
