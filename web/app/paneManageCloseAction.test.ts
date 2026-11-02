import test from 'node:test'
import assert from 'node:assert/strict'
import { createPaneManageActions } from './paneManageActions'
import { workspaceApi } from '../infra/workspaceApi'
import { PaneCloseError } from '../domain/paneCloseError'
import r from '../resources.json'

test('close action shows the mapped resource message', async () => {
  const old = workspaceApi.closePane
  const busy: boolean[] = []
  const messages: (string | null)[] = []
  const s = {
    template: 'opencode', name: '',
    setBusy: (v: boolean) => { busy.push(v) },
    setMsg: (v: string | null) => { messages.push(v) },
    setConfirmId: () => {},
    load: async () => [],
  }
  workspaceApi.closePane = async () => { throw new PaneCloseError('pending_reservations') }
  try {
    await createPaneManageActions(s as never).close('w:p1')
  } finally {
    workspaceApi.closePane = old
  }
  assert.deepEqual(busy, [true, false])
  assert.deepEqual(messages, [null, r.paneClosePending])
})
