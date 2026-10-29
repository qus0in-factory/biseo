import type { VisualViewportLike, VisualViewportTargets } from './visualViewportTypes.js'

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
