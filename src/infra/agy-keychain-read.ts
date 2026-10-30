import { execFile } from 'node:child_process'
import { agyKeychainConfig } from './agy-keychain-config.js'

export function readAgyKeychain(): Promise<string | null> {
  const c = agyKeychainConfig()
  if (!c.enabled || process.platform !== 'darwin') return Promise.resolve(null)
  return new Promise((resolve) => {
    const args = ['find-generic-password', '-s', c.service, '-a', c.account, '-w']
    execFile('security', args, { timeout: 5000 }, (err, stdout) => {
      if (err) return resolve(null)
      const v = String(stdout).trim()
      resolve(v ? v : null)
    })
  })
}
