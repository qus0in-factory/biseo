import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'

let memGrokToken: string | null = null

export const getMemoryGrokToken = () => memGrokToken
export const setMemoryGrokToken = (t: string | null) => { memGrokToken = t }

export async function refreshGrokToken(rt: string): Promise<string | null> {
  try {
    const cid = 'b1a00492-073a-47ea-816f-4c329264a828'
    const b = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: rt, client_id: cid })
    const res = await fetch(ep().grokRefresh, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: b.toString(),
      signal: AbortSignal.timeout(to())
    })
    if (!res.ok) return null
    const data: any = await res.json()
    const at = typeof data?.access_token === 'string' ? data.access_token : null
    if (at) setMemoryGrokToken(at)
    return at
  } catch {
    return null
  }
}
