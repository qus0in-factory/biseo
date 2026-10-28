import type { HerdrUpstreamPort, PanesPayload } from '../app/timeline-ports.js'
import type { TimelineItem } from '../domain/timeline-types.js'
import type { UpstreamEnv } from './herdr-upstream-config.js'
import { callUpstreamJson } from './herdr-upstream-http.js'
import { openUpstreamEvents } from './herdr-upstream-stream.js'
import { resolveRequestId } from './upstream-log.js'

export function createHerdrUpstream(env: UpstreamEnv, src?: Parameters<typeof resolveRequestId>[0]): HerdrUpstreamPort {
  const id = resolveRequestId(src)
  return {
    listPanes: (ws) => callUpstreamJson<PanesPayload>(env, `/herdr/workspaces/${encodeURIComponent(ws)}/panes`, 'GET', undefined, id),
    submitTurn: (input) => callUpstreamJson(env, '/herdr/turns', 'POST', input, id),
    getTurn: (tid) => callUpstreamJson<TimelineItem>(env, `/herdr/turns/${encodeURIComponent(tid)}`, 'GET', undefined, id),
    openEventStream: (ws, lastId, sig) => openUpstreamEvents(env, ws, lastId, sig, id),
  }
}
