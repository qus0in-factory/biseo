import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useWorkspaceSelection } from './useWorkspaceSelection'
import type { AppConfig, WorkspaceApiPort } from '../domain/ports'
import { deferredTestPromise } from '../test-util/deferredTestPromise'
import { selectWorkspaceAndRefresh } from '../ui/workspacePickerSelect'
import { isWorkspaceSelectionPending } from '../ui/workspaceSelectionGuard'

function selection(selectWorkspace: NonNullable<WorkspaceApiPort['selectWorkspace']>, apply: (id: string) => void) {
  let result!: ReturnType<typeof useWorkspaceSelection>
  function Probe() {
    result = useWorkspaceSelection({ selectWorkspace } as WorkspaceApiPort, apply)
    return null
  }
  renderToStaticMarkup(createElement(Probe))
  return result.selectWorkspace
}

test('selection action ignores late old A and B responses after the newest A succeeds', async () => {
  const pending = [deferredTestPromise<AppConfig>(), deferredTestPromise<AppConfig>(), deferredTestPromise<AppConfig>()]
  const calls: string[] = []
  const applied: string[] = []
  const select = selection(id => { calls.push(id); return pending[calls.length - 1].promise }, id => applied.push(id))
  const oldA = select('A')
  const oldB = select('B')
  const newA = select('A')
  pending[2].resolve({ workspaceId: 'A' })
  assert.deepEqual(await newA, { workspaceId: 'A' })
  pending[1].resolve({ workspaceId: 'B' })
  pending[0].resolve({ workspaceId: 'A' })
  assert.equal(await oldB, null)
  assert.equal(await oldA, null)
  assert.deepEqual(calls, ['A', 'B', 'A'])
  assert.deepEqual(applied, ['A'])
})

test('picker blocks duplicate hook selection while pending; failed B preserves A and permits retry', async () => {
  let current = 'A'
  let calls = 0
  let pending = deferredTestPromise<AppConfig>()
  const select = selection(() => { calls++; return pending.promise }, id => { current = id })
  let loading = false
  let error: string | null = null
  let reloads = 0
  const handlers = {
    setLoading: (v: boolean) => { loading = v }, setError: (v: string | null) => { error = v },
    setCurrent: (v: string) => { current = v }, setNotice() {}, reload: () => { reloads++ },
  }
  const first = selectWorkspaceAndRefresh(select, 'B', handlers)
  assert.equal(loading, true)
  assert.equal(isWorkspaceSelectionPending(), true)
  const duplicate = await selectWorkspaceAndRefresh(select, 'B', handlers)
  assert.equal(duplicate, null)
  assert.equal(calls, 1)
  pending.reject(new Error('offline'))
  assert.equal(await first, null)
  assert.equal(current, 'A')
  assert.equal(error, 'connection_unavailable')
  assert.equal(loading, false)
  assert.equal(isWorkspaceSelectionPending(), false)
  assert.equal(reloads, 0)
  pending = deferredTestPromise<AppConfig>()
  const retry = selectWorkspaceAndRefresh(select, 'B', handlers)
  pending.resolve({ workspaceId: 'B' })
  assert.deepEqual(await retry, { workspaceId: 'B' })
  assert.equal(current, 'B')
  assert.equal(calls, 2)
  assert.equal(reloads, 1)
  assert.equal(error, null)
  assert.equal(loading, false)
})
