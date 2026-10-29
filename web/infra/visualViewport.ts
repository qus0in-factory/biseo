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

export function applyVisualViewport(
  vv: VisualViewportLike,
  doc: VisualViewportTargets['document'] = typeof document !== 'undefined' ? (document as any) : undefined,
): void {
  if (!doc?.documentElement?.style) return
  const s = doc.documentElement.style
  s.setProperty('--visual-viewport-height', `${vv.height}px`)
  s.setProperty('--visual-viewport-width', `${vv.width}px`)
  s.setProperty('--visual-viewport-offset-top', `${vv.offsetTop}px`)
  s.setProperty('--visual-viewport-offset-left', `${vv.offsetLeft}px`)
}

export function bindVisualViewport(
  onUpdate?: (vv: VisualViewportLike) => void,
  targets?: VisualViewportTargets,
): () => void {
  const win = targets?.window ?? (typeof window !== 'undefined' ? (window as any) : undefined)
  const doc = targets?.document ?? (typeof document !== 'undefined' ? (document as any) : undefined)
  const vv = win?.visualViewport
  if (!vv || !doc?.documentElement?.style) return () => {}

  const update = () => {
    applyVisualViewport(vv, doc)
    try { onUpdate?.(vv) } catch {}
  }
  vv.addEventListener('resize', update)
  vv.addEventListener('scroll', update)
  update()
  return () => {
    vv.removeEventListener('resize', update)
    vv.removeEventListener('scroll', update)
  }
}

export const bindVisualViewportHeight = bindVisualViewport
export const observeVisualViewport = bindVisualViewport

if (typeof window !== 'undefined') {
  bindVisualViewport()
}
