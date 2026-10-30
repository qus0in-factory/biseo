import { useEffect, useState } from 'react'
import { moveUsageId, parseUsageOrder, serializeUsageOrder, type UsageOrder } from '../domain/usageOrder'
import { toggleUsageBookmark as t } from '../domain/usageBookmarks'
const KEY = 'biseo:usage-order'
export type UsageOrderState = UsageOrder & { move: (list: string[], id: string, dir: number) => void; toggleHide: (id: string) => void; setOrder: (order: string[]) => void }
export function useUsageOrder(): UsageOrderState {
  const [saved, setSaved] = useState<UsageOrder>(() => typeof window === 'undefined' ? { order: [], hidden: [] } : parseUsageOrder(window.localStorage.getItem(KEY)))
  useEffect(() => { try { window.localStorage.setItem(KEY, serializeUsageOrder(saved)) } catch {} }, [saved])
  return { ...saved, move: (list, id, dir) => setSaved((p) => ({ ...p, order: moveUsageId(list, id, dir) })), toggleHide: (id) => setSaved((p) => ({ ...p, hidden: t(p.hidden, id) })), setOrder: (order) => setSaved((p) => ({ ...p, order })) }
}
