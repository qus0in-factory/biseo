import { spawn } from 'node:child_process'
import { agyCliConfig } from './agy-cli-config.js'

export type AgyCliRun = (path: string, args: string[], timeoutMs: number) => Promise<string>

const defaultRun: AgyCliRun = (path, args, timeoutMs) => new Promise((res, rej) => {
  const c = spawn(path, args, { timeout: timeoutMs, stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''
  c.stdout.on('data', (d: Buffer) => { if (out.length < 1048576) out += d })
  c.on('error', rej)
  c.on('close', (code) => code === 0 ? res(out) : rej(new Error('exit')))
})

let run: AgyCliRun = defaultRun

export const setAgyCliRun = (r: AgyCliRun): void => { run = r }
export const resetAgyCliRun = (): void => { run = defaultRun }

export function runAgyCli(): Promise<string | null> {
  const c = agyCliConfig()
  if (!c.enabled) return Promise.resolve(null)
  return run(c.path, c.args, c.timeoutMs).then((o) => o, () => null)
}
