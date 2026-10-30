export interface AgyKeychainConfig {
  service: string
  account: string
  enabled: boolean
}

export function agyKeychainConfig(): AgyKeychainConfig {
  const e = process.env
  return {
    service: e.BISEO_AGY_KEYCHAIN_SERVICE ?? 'gemini',
    account: e.BISEO_AGY_KEYCHAIN_ACCOUNT ?? 'antigravity',
    enabled: e.BISEO_AGY_KEYCHAIN_ENABLED !== '0'
  }
}
