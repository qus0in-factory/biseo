import type { TimelineItem } from '../domain/timeline'
import type { WorkspaceApiPort } from '../domain/ports'

export async function syncPending(
  api: WorkspaceApiPort,
  items: TimelineItem[],
  onUpdate: (item: TimelineItem) => void,
) {
  const pending = items.filter(
    (i) => i.status === 'queued' || i.status === 'working' || i.status === 'timeout' ||
      (i.status === 'failed' && i.errorCode === 'delivery_uncertain'),
  )
  await Promise.all(
    pending.map(async (p) => {
      try {
        const item = await api.getTurn(p.requestId)
        onUpdate(item)
      } catch {
        // keep optimistic or ignore
      }
    }),
  )
}
