import { useCallback, useLayoutEffect, useRef } from 'react'
import { keepScrollTop } from '../domain/scrollPreserve'

export function useLoadOlder(
  ref: React.RefObject<HTMLDivElement | null>,
  onLoadOlder?: () => void,
  olderLoaded = 0,
) {
  const before = useRef<{ h: number; t: number } | null>(null)

  const load = useCallback(() => {
    const el = ref.current
    if (!onLoadOlder || !el || el.scrollTop > 32) return
    before.current = { h: el.scrollHeight, t: el.scrollTop }
    onLoadOlder()
  }, [onLoadOlder, ref])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !before.current) return
    el.scrollTop = keepScrollTop(before.current.h, before.current.t, el.scrollHeight)
    before.current = null
  }, [olderLoaded, ref])

  return load
}
