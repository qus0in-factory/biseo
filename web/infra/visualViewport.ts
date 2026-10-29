export type { VisualViewportLike, VisualViewportTargets } from './visualViewportTypes.js'
export { applyVisualViewport } from './visualViewportApply.js'
export { bindVisualViewport, bindVisualViewportHeight, observeVisualViewport } from './visualViewportBind.js'

import { bindVisualViewport } from './visualViewportBind.js'
if (typeof window !== 'undefined') {
  bindVisualViewport()
}
