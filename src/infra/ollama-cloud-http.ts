import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseOllamaCloudUsage } from './ollama-cloud-parse.js'

export async function fetchOllamaCloudMetrics(authorize: (c: string) => string, ts: number): Promise<{ metrics: any[]; primaryPercent: number | null }> {
  const uri = `/api/usage?ts=${ts}`
  const metrics: any[] = []
  let primaryPercent: number | null = null
  try {
    const res = await fetch(`${ep().ollamaCloudUsage.replace(/\/api\/usage$/, '')}${uri}`, {
      headers: { Authorization: authorize(`GET,${uri}`), Accept: 'application/json' },
      signal: AbortSignal.timeout(to())
    })
    if (res.ok) {
      const data = await res.json()
      const parsed = parseOllamaCloudUsage(data)
      metrics.push(...parsed)
      const session = parsed.find((m: any) => m.id === 'session')
      if (session && typeof session.used === 'number') primaryPercent = session.used
    }
  } catch { /* ignore */ }
  return { metrics, primaryPercent }
}
