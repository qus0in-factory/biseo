import { execFile } from 'node:child_process'
import { agyKeychainConfig } from './agy-keychain-config.js'

export type AgyKeychainRun = (args: string[]) => Promise<string>

const defaultRun: AgyKeychainRun = (args) => new Promise((res, rej) => {
  execFile('security', args, { timeout: 5000 }, (err, stdout) => err ? rej(err) : res(String(stdout)))
})

export function readAgyKeychain(run: AgyKeychainRun = defaultRun): Promise<string | null> {
  const c = agyKeychainConfig()
  if (!c.enabled || process.platform !== 'darwin') return Promise.resolve(null)
  const args = ['find-generic-password', '-s', c.service, '-a', c.account, '-w']
  return run(args).then((out) => {
    const v = out.trim()
    return v ? v : null
  }, () => null)
}
