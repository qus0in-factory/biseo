import type { config } from './config.js'
import { validateBootConfig } from './config-boot.js'
import { missingConfigKeys } from './config-missing.js'

export function validateBootOrExit(c: typeof config) {
  try {
    validateBootConfig(c)
  } catch {
    for (const key of missingConfigKeys(c)) console.error(key)
    process.exit(1)
  }
}
