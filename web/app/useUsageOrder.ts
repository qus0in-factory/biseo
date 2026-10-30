import { useEffect, useState } from 'react'
import {
  parseUsageOrder,
  serializeUsageOrder,
  type UsageOrder,
} from '../domain/usageOrder'
import { toggleUsageBookmark as t } from '../domain/usageBookmarks'

const KEY = 'biseo:usage-order'

export type UsageOrderState = UsageOrder & {
  toggleHide: (id: string) => void
}

export function useUsageOrder(): UsageOrderState {
  const [saved, setSaved] = useState<UsageOrder>(() =>
    typeof window === 'undefined'
      ? { order: [], hidden: [] }
      : { order: [], hidden: parseUsageOrder(window.localStorage.getItem(KEY)).hidden }
  )
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, serializeUsageOrder({ order: [], hidden: saved.hidden }))
    } catch {}
  }, [saved])
  return {
    ...saved,
    toggleHide: (id) =>
      setSaved((p) => ({ ...p, hidden: t(p.hidden, id) })),
  }
}