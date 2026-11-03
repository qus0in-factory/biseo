import { loadOlderPage } from '../app/timelineOlderLoad'
import { deferredTestPromise } from './deferredTestPromise'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { TimelinePage } from '../domain/timelinePagingTypes'

export function olderFixture() {
  const page: TimelinePage = { items: [], hasMore: false, nextBefore: null }
  const requests: ReturnType<typeof deferredTestPromise<TimelinePage>>[] = []
  let updates = 0
  const r = {
    p: { getTimeline: () => {
      const d = deferredTestPromise<TimelinePage>()
      requests.push(d)
      return d.promise
    } } as unknown as P,
    w: 'A', paneId: 'pA', gen: { current: 0 },
    ref: { current: { items: [], hasMore: true, before: 10 } },
    loading: { current: false }, requested: { current: null as number | null },
    setPaging: () => { updates++ },
  }
  return { r, page, requests, updates: () => updates, run: () => loadOlderPage(r) }
}
