const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
  'Spacebar',
])

type Pointer = { clientX: number; target: EventTarget | null }
type Key = { key: string }

export const scrollsViewport = (key: string) => SCROLL_KEYS.has(key)

/** 세로 스크롤바에서 시작한 포인터만 사용자 스크롤로 본다. */
export const isScrollbarPointer = (el: HTMLElement | null, e: Pointer) => {
  if (!el || e.target !== el) return false
  const x = e.clientX - el.getBoundingClientRect().left
  return x >= el.clientWidth || x >= el.offsetWidth - 16
}

export const createScrollHandlers = (
  getEl: () => HTMLElement | null,
  onInput: () => void,
) => ({
  onWheel: onInput,
  onTouchMove: onInput,
  onKeyDown: (e: Key) => { if (scrollsViewport(e.key)) onInput() },
  onPointerDown: (e: Pointer) => { if (isScrollbarPointer(getEl(), e)) onInput() },
})
