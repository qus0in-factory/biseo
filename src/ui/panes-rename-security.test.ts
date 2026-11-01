import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.js'
import { reader } from '../app/turn-data-fixture.js'
import { makePane } from './pane-manage-fixture.js'
import { renamePaneCheck } from './panes-rename-check.js'
import { loadCoordinatorLabels } from '../infra/coordinator-panels.js'

test('rename cannot remove or impersonate coordinator protection', async () => {
  const d = makeDeps(reader)
  const label = loadCoordinatorLabels()[0]
  assert.ok(label)
  d.herdr.getPane = async () => makePane({ label })
  assert.equal((await renamePaneCheck(d, 'w:p1', 'worker')).s, 403)
  d.herdr.getPane = async () => makePane()
  assert.equal((await renamePaneCheck(d, 'w:p1', label)).s, 403)
})
