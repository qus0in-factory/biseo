import { useEffect, useState } from 'react'
import { moveUsageId, parseUsageOrder, serializeUsageOrder, type UsageOrder } from '../domain/usageOrder'
import { toggleUsageBookmark } from '../domain/usageBookmarks'

const KEY = 'biseo:usage-order'

export type UsageOrderState = UsageOrder & {
  move: (list: string[], id: string, dir: number) => void
  toggleHide: (id: string) => void
}

export function useUsageOrder(): UsageOrderState {
  const [saved, setSaved] = useState<UsageOrder>(() => {
    if (typeof window === 'undefined') return { order: [], hidden: [] }
    return parseUsageOrder(window.localStorage.getItem(KEY))
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, serializeUsageOrder(saved))
    } catch {}
  }, [saved])
  return {
    ...saved,
    move: (list, id, dir) => setSaved((p) => ({ ...p, order: moveUsageId(list, id, dir) })),
    toggleHide: (id) => setSaved((p) => ({ ...p, hidden: toggleUsageBookmark(p.hidden, id) })),
  }
}
