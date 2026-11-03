import { useLayoutEffect, useRef } from 'react'
import { createBottomReach } from './bottomReach'

export function useBottomReached(
  ref: React.RefObject<HTMLDivElement | null>,
  onReachBottom?: () => void,
) {
  const reach = useRef(onReachBottom)
  reach.current = onReachBottom
  const box = useRef<ReturnType<typeof createBottomReach> | null>(null)
  const g = box.current ??= createBottomReach(
    () => ref.current,
    () => reach.current?.(),
    (el) => el.scrollTo({ top: el.scrollTop, behavior: 'auto' }),
  )
  useLayoutEffect(() => { g.init() }, [g])
  return g
}
