import type { HerdrUpstreamPort, PanesPayload } from '../app/timeline-ports.js'
import type { TimelineItem } from '../domain/timeline-types.js'
import type { UpstreamEnv } from './herdr-upstream-config.js'
import { callUpstreamJson } from './herdr-upstream-http.js'
import { openUpstreamEvents } from './herdr-upstream-stream.js'

export function createHerdrUpstream(env: UpstreamEnv): HerdrUpstreamPort {
  return {
    listPanes: (wsId) =>
      callUpstreamJson<PanesPayload>(
        env,
        `/herdr/workspaces/${encodeURIComponent(wsId)}/panes`,
        'GET',
      ),
    submitTurn: (input) => callUpstreamJson(env, '/herdr/turns', 'POST', input),
    getTurn: (id) =>
      callUpstreamJson<TimelineItem>(env, `/herdr/turns/${encodeURIComponent(id)}`, 'GET'),
    openEventStream: (wsId, lastEventId, signal) =>
      openUpstreamEvents(env, wsId, lastEventId, signal),
  }
}
