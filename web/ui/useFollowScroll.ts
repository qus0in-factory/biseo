import { useCallback, useRef, useState } from 'react'
import { isNearBottom } from './scrollHelper'

/** 하단 추적 상태. prepend 직후에는 보정 위치 위로 내려가야 다시 추적한다. */
export function useFollowScroll() {
  const followRef = useRef(true)
  const resumeAboveRef = useRef(0)
  const lastTopRef = useRef(0)
  const lastHeightRef = useRef(0)
  const [jump, setJump] = useState(false)

  const follow = useCallback(() => {
    followRef.current = true
    resumeAboveRef.current = 0
    setJump(false)
  }, [])

  const release = useCallback((top = 0) => {
    followRef.current = false
    resumeAboveRef.current = top
  }, [])

  const onScroll = useCallback((el: HTMLElement) => {
    const grew = el.scrollHeight > lastHeightRef.current
    if (el.scrollTop < lastTopRef.current - 1) release()
    else if (!grew && isNearBottom(el) && el.scrollTop > resumeAboveRef.current) follow()
    if (grew && !followRef.current) resumeAboveRef.current = el.scrollTop
    lastTopRef.current = el.scrollTop
    lastHeightRef.current = el.scrollHeight
  }, [follow, release])

  const showJump = useCallback(() => setJump(true), [])

  return { followRef, jump, follow, release, onScroll, showJump }
}
