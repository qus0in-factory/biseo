import { makeDeps } from './turn-fixture.js'
import { pane, reader } from './turn-data-fixture.js'
import type { AuditLog } from './interrupt-audit.js'
import type { PaneStatus } from '../domain/timeline.js'
import { allow } from './interrupt-pane-fixture.js'

export function setup(overrides: { agent?: string; workspace?: string; status?: PaneStatus; send?: (id: string, keys: string) => Promise<void> } = {}) {
  const d = makeDeps(reader)
  const logs: Record<string, unknown>[] = []
  const audit: AuditLog = { info: (o) => logs.push(o as Record<string, unknown>), msg: () => {} } as AuditLog
  d.herdr.getPane = async () => ({
    ...pane,
    agent: overrides.agent ?? 'claude',
    agent_status: overrides.status ?? 'blocked',
    workspace_id: overrides.workspace ?? 'w',
  })
  d.herdr.sendKeys = overrides.send ?? (async () => {})
  const deps = { ...d, interruptAllowlist: allow, audit }
  return { deps, logs }
}
