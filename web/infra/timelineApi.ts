import ky from './sessionHttp'
import type { TimelineItem } from '../domain/timeline'
import type { TimelinePage, TimelineQuery } from '../domain/timelinePagingTypes'
import { opts } from './apiOptions'

export const timelineQuery = (ws: string, q: TimelineQuery = {}) => {
  const p = new URLSearchParams({ workspaceId: ws, limit: String(q.limit ?? 3) })
  if (q.paneId) p.set('paneId', q.paneId)
  if (q.before != null) p.set('before', String(q.before))
  return p.toString()
}

export const getTimelinePage = async (ws: string, q: TimelineQuery = {}): Promise<TimelinePage> => {
  const res = await ky
    .get(`/api/timeline/messages?${timelineQuery(ws, q)}`, opts)
    .json<{ items: TimelineItem[]; hasMore?: boolean; nextBefore?: number | null }>()
  return { items: res.items || [], hasMore: res.hasMore ?? false, nextBefore: res.nextBefore ?? null }
}
