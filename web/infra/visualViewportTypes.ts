export interface VisualViewportLike {
  height: number
  width: number
  offsetTop: number
  offsetLeft: number
  addEventListener(type: string, cb: () => void): void
  removeEventListener(type: string, cb: () => void): void
}

export interface VisualViewportTargets {
  window?: { visualViewport?: VisualViewportLike | null }
  document?: { documentElement: { style: { setProperty(name: string, value: string): void } } }
}
