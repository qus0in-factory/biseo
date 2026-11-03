import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the main selector renders tabs through the shared one-step path', () => {
 const code = src('./WorkspaceSwitcher.tsx')
 assert.match(code, /WorkspaceTabs/)
 assert.match(code, /useWorkspaceTabChoice\(workspaceApi, select, current, s\)/)
 assert.ok(!code.includes('WorkspacePickerDialog'))
 assert.match(code, /missingWorkspaceNotice/)
})
