import { useCallback, useLayoutEffect, useRef } from 'react'
import { keepScrollTop } from '../domain/scrollPreserve'

export function useLoadOlder(
  ref: React.RefObject<HTMLDivElement | null>,
  onLoadOlder?: () => void,
  olderLoaded = 0,
  releaseFollow?: (top?: number) => void,
) {
  const before = useRef<{ h: number; t: number } | null>(null)

  const load = useCallback(() => {
    const el = ref.current
    if (!onLoadOlder || !el || el.scrollTop > 32) return
    before.current = { h: el.scrollHeight, t: el.scrollTop }
    releaseFollow?.()
    onLoadOlder()
  }, [onLoadOlder, ref, releaseFollow])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !before.current) return
    const top = keepScrollTop(before.current.h, before.current.t, el.scrollHeight)
    el.scrollTop = top
    releaseFollow?.(top)
    before.current = null
  }, [olderLoaded, ref, releaseFollow])

  return load
}
