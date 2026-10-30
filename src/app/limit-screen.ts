import { isLimitMarker } from '../domain/limit-marker.js'
import type { HerdrPort } from './ports.js'

export type LimitScreen = { classify(paneId: string): Promise<boolean> }

export function limitScreen(herdr: HerdrPort, markers: string[], lines = 8): LimitScreen {
  return {
    async classify(paneId) {
      if (!markers.length || !herdr.readRecent) return false
      return isLimitMarker(await herdr.readRecent(paneId, lines), markers)
    },
  }
}

export const inputScreen = limitScreen
export const approvalScreen = limitScreen
