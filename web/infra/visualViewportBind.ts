import type { VisualViewportLike, VisualViewportTargets } from './visualViewportTypes.js'
import { applyVisualViewport } from './visualViewportApply.js'

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
