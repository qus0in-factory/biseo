import type { Options } from 'ky'
import { upstreamRetry } from './herdr-upstream-retry.js'

export function upstreamPolicy(id: string, method: 'GET' | 'POST' | 'DELETE', path: string, timeout: number): Pick<Options, 'timeout' | 'retry' | 'hooks'> {
 return path === '/herdr/usage'
  ? { timeout: 30000, retry: 0 }
  : { timeout, ...upstreamRetry(id, method, path) }
}
