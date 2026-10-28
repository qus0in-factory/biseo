import { type UpstreamEnv, prepareUpstreamCall } from './herdr-upstream-config.js'

export async function openUpstreamEvents(
  env: UpstreamEnv,
  wsId: string,
  lastEventId?: string | null,
  signal?: AbortSignal,
): Promise<Response | { status: 502; error: string }> {
  const cfg = await prepareUpstreamCall(env)
  if (!cfg) return { status: 502, error: 'misconfigured' }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${cfg.token}`,
    Accept: 'text/event-stream',
  }
  if (lastEventId) headers['Last-Event-ID'] = lastEventId
  try {
    const u = `${cfg.base}/herdr/events?workspaceId=${encodeURIComponent(wsId)}`
    const res = await fetch(u, { headers, signal })
    if (!res.ok || !res.body) return { status: 502, error: 'bad_gateway' }
    return res
  } catch {
    return { status: 502, error: 'bad_gateway' }
  }
}
