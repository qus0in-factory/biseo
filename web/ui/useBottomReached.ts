import { useCallback, useRef } from 'react'
import { isNearBottom } from './scrollHelper'
import { shouldResetScroll } from './scrollReset'

export function useBottomReached(onReachBottom?: () => void) {
  const bottomRef = useRef(false)
  const autoRef = useRef(false)

  const init = useCallback((el: HTMLElement | null) => {
    bottomRef.current = isNearBottom(el)
  }, [])

  const begin = useCallback((el: HTMLElement | null) => {
    if (isNearBottom(el)) return
    autoRef.current = true
  }, [])

  const resetAuto = useCallback(() => {
    autoRef.current = false
  }, [])

  const check = useCallback((el: HTMLElement | null) => {
    const isNear = isNearBottom(el)
    const wasNear = bottomRef.current
    bottomRef.current = isNear
    if (shouldResetScroll(wasNear, isNear, autoRef.current)) onReachBottom?.()
    if (isNear) autoRef.current = false
    return isNear
  }, [onReachBottom])

  return { init, begin, resetAuto, check }
}
