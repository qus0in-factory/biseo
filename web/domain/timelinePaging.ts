import { mergeServerTimeline } from './timelineHydrate'
import type { Paging, TimelinePage } from './timelinePagingTypes'

export const startPaging = (): Paging => ({ items: [], hasMore: true, before: null })

export const mergeLatest = (p: Paging, page: TimelinePage): Paging => {
  const keep = p.before != null && page.nextBefore != null && p.before <= page.nextBefore
  return {
    items: mergeServerTimeline(p.items, page.items),
    before: keep ? p.before : page.nextBefore,
    hasMore: keep ? p.hasMore : page.hasMore,
  }
}

export const addOlder = (p: Paging, page: TimelinePage): Paging => ({
  items: mergeServerTimeline(p.items, page.items),
  before: page.nextBefore,
  hasMore: page.hasMore,
})

export const canLoadOlder = (p: Paging, loading: boolean, requested: number | null) =>
  p.hasMore && !loading && p.before != null && requested !== p.before
