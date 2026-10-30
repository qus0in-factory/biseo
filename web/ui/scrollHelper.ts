import type { TimelineItem } from '../domain/timeline'

export const isReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isNearBottom = (el: HTMLElement | null, gap = 64): boolean =>
  el ? el.scrollHeight - el.scrollTop - el.clientHeight <= gap : false

export const scrollDown = (el: HTMLElement | null): void => {
  if (!el) return
  const behavior = isReducedMotion() ? 'auto' : 'smooth'
  el.scrollTo({ top: el.scrollHeight, behavior })
}

export const itemsKey = (list: readonly TimelineItem[]): string =>
  `${list.length}:${list.map((i) => `${i.requestId}:${i.status}`).join('|')}`
