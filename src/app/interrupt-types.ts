import type { AvailabilityPort, HerdrPort } from './ports.js'
import type { AuditLog } from './interrupt-audit.js'
import type { InterruptKey } from '../domain/interrupt-key.js'

export type InterruptDeps = {
  herdr: HerdrPort
  availability?: AvailabilityPort
  allowedWorkspaceId?: string
  interruptAllowlist?: Record<string, string[]>
  audit?: AuditLog
}

export type InterruptFail = {
  status: 403 | 404 | 409 | 502
  body: Record<string, unknown>
}

export type InterruptOk = {
  status: 200
  body: { paneId: string; key: InterruptKey; status: 'sent' }
}

export type InterruptBad = { status: 400; body: Record<string, unknown> }
