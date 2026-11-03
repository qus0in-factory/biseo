import { createRecoveryRefs } from './recoveryRefs'
import { deferredTestPromise } from './deferredTestPromise'
import { syncPending } from '../domain/syncPending'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { TimelineItem as T } from '../domain/timeline'

export function recoveryFixture() {
  const item: T = { requestId: 'r', workspaceId: 'A', paneId: 'pA',
    targetName: 'T', promptText: 'x', status: 'working', createdAt: '' }
  const pending = deferredTestPromise<T>()
  const refs = createRecoveryRefs()
  const applied: T[] = []
  const refresh = (w: string) => refs.refresh([item], x => applied.push(x), w)
  refresh('A')
  const api = { getTurn: () => pending.promise } as unknown as P
  const run = () => syncPending(api, refs.getItems(), refs.getUpdate())
  return { item, pending, refs, applied, refresh, run }
}
