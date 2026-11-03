import type { CapturePort, HerdrPort } from '../../src/app/ports.js'
import { antigravityResponse } from '../../src/domain/antigravity-response.js'
import { zeroShotAgent, zeroShotPane } from './zero-shot-data-fixture.js'
import { ZERO_SHOT_RECORDS_JSONL } from './zero-shot-record-fixture.js'

export function createZeroShotPorts() {
  let calls = 0
  let raw = ''
  const herdr: HerdrPort = {
    listPanes: async () => [zeroShotPane],
    listAgents: async () => [zeroShotAgent],
    getPane: async () => zeroShotPane,
    getAgent: async () => zeroShotAgent,
    prompt: async () => {
      calls++
      raw = ZERO_SHOT_RECORDS_JSONL
    },
  }
  const capture: CapturePort = {
    begin: async (_s, _c, p) => ({ read: async () => antigravityResponse(raw, p) }),
  }
  return { herdr, capture, getPromptCalls: () => calls }
}
