import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
const screens = 'PaneManageSection WorkspacePickerView PanesView UsagePanel UsageTabsAsync TimelineAsync'.split(' ')
test('screens use shared loading', () => {
  assert.match(src('./UsageHistoryBody.tsx'), /<LoadingState rows=\{2\}/)
  assert.match(src('./LoginForm.tsx'), /<LoginLoading\/>/)
  assert.match(src('./LoadingState.tsx'), /export function LoginLoading\(\)/)
  assert.match(src('./AsyncList.tsx'), /<LoadingState/)
  for (const f of screens) assert.match(src(`./${f}.tsx`), /<AsyncList/, f)
})
