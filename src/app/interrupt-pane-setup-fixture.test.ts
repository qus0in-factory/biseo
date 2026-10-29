import { makeDeps } from './turn-fixture.test.js'
import { pane, reader } from './turn-fixture-data.test.js'
import type { AuditLog } from './interrupt-audit.js'
import type { PaneStatus } from '../domain/timeline.js'
import { allow } from './interrupt-pane-fixture.test.js'

export function setup(overrides: { agent?: string; workspace?: string; status?: PaneStatus; send?: (...args: any[]) => Promise<void> } = {}) {
  const d = makeDeps(reader)
  const logs: Record<string, unknown>[] = []
  const audit: AuditLog = { info: (o) => logs.push(o), msg: () => {} } as AuditLog
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
