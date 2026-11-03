import type { HerdrPort } from './ports.js'
import type { TurnStore } from './turn-store.js'
import type { BlockedDeps } from './turn-blocked-error.js'
export type CaptureTurnDeps = BlockedDeps & {
  herdr: HerdrPort
  store: TurnStore
  timeoutMs: number
  lateCaptureMs?: number
  promptAcceptanceMs?: number
}
