import { useEffect, useState } from 'react'
import { parseUsageBookmarks, serializeUsageBookmarks, toggleUsageBookmark } from '../domain/usageBookmarks'

const KEY = 'biseo:usage-bookmarks'

export function useUsageBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return parseUsageBookmarks(window.localStorage.getItem(KEY)) } catch { return [] }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, serializeUsageBookmarks(bookmarks)) } catch {}
  }, [bookmarks])
  return { bookmarks, toggle: (id: string) => setBookmarks((prev) => toggleUsageBookmark(prev, id)) }
}