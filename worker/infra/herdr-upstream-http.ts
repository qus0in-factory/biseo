import ky, { TimeoutError } from 'ky'
import type { UpstreamResult } from '../app/timeline-ports.js'
import { type UpstreamEnv, prepareUpstreamCall } from './herdr-upstream-config.js'
import { parseUpstreamResponse } from './herdr-upstream-parse.js'

export async function callUpstreamJson<T>(
  env: UpstreamEnv,
  path: string,
  method: 'GET' | 'POST',
  json?: unknown,
): Promise<UpstreamResult<T>> {
  const cfg = await prepareUpstreamCall(env)
  if (!cfg) return { ok: false, status: 502, body: { error: 'misconfigured' } }
  try {
    const res = await ky(`${cfg.base}${path}`, {
      method,
      retry: 0,
      timeout: cfg.timeoutMs,
      throwHttpErrors: false,
      headers: { Authorization: `Bearer ${cfg.token}` },
      ...(json !== undefined ? { json } : {}),
    })
    return await parseUpstreamResponse<T>(res)
  } catch (e) {
    const t = e instanceof TimeoutError
    return { ok: false, status: t ? 504 : 502, body: { error: t ? 'timeout' : 'bad_gateway' } }
  }
}
