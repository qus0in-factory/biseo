import type { KeyboardEvent } from 'react'

export const isMobileDevice = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)

export function shouldSendOnEnter(
  e: KeyboardEvent<HTMLTextAreaElement>,
  isMobile = isMobileDevice(),
): boolean {
  if (e.key !== 'Enter' || isMobile) return false
  if (e.nativeEvent.isComposing) return false
  return !e.shiftKey
}
