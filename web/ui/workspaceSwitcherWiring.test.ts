import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the main selector renders tabs through the shared one-step path', () => {
 const view = src('./WorkspaceSwitcher.tsx')
 const state = src('./useWorkspaceSwitcherState.ts')
 assert.match(view, /WorkspaceTabs/)
 assert.match(state, /useWorkspaceTabChoice\(workspaceApi, select, current, s\)/)
 assert.ok(!view.includes('WorkspacePickerDialog'))
 assert.match(state, /missingWorkspaceNotice/)
})
