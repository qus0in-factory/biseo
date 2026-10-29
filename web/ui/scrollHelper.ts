import type { TimelineItem } from '../domain/timeline'

export const isReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isNearBottom = (el: HTMLElement, gap = 64): boolean =>
  el.scrollHeight - el.scrollTop - el.clientHeight <= gap

export const scrollDown = (el: HTMLElement): void => {
  const behavior = isReducedMotion() ? 'auto' : 'smooth'
  el.scrollTo({ top: el.scrollHeight, behavior })
}

export const itemsKey = (list: TimelineItem[]): string =>
  `${list.length}:${list.map((i) => `${i.requestId}:${i.status}`).join('|')}`
