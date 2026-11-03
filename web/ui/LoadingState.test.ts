import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoadingState } from './LoadingState'
import r from '../resources.json'
import { readdirSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('loading uses a shared reduced-motion skeleton', () => {
  const state = src('./LoadingState.tsx')
  const rows = src('./LoadingRows.tsx')
  assert.match(state, /LoadingRows/)
  assert.match(rows, /bg-muted/)
  assert.match(rows, /animate-pulse/)
  assert.match(rows, /motion-reduce:animate-none/)
  assert.match(src('./AsyncList.tsx'), /state\.status === 'empty'/)
  assert.match(src('./AsyncFallback.tsx'), /r\.retry/)
})

test('common loading and notice components keep space above them', () => {
  assert.match(src('./LoadingState.tsx'), /'mt-4'/)
  assert.match(src('./LoadingState.tsx'), /className="mt-2 /)
  assert.match(src('./AsyncRefreshing.tsx'), /variant="inline"/)
  assert.match(src('./AsyncFallback.tsx'), /'mt-4 flex flex-col/)
  assert.match(src('./AsyncList.tsx'), /<div className="mt-4">/)
})
test('loading text keeps one fixed gap below the skeleton', () => {
  const list = renderToStaticMarkup(createElement(LoadingState, { rows: 2 }))
  assert.match(list, /role="status"/)
  assert.match(list, /aria-busy="true"/)
  assert.match(list, /class="mt-4 flex flex-col gap-2"/)
  assert.match(list, /h-10 rounded-md bg-muted animate-pulse/)
  assert.ok(list.includes(r.loading))
  const login = renderToStaticMarkup(createElement(LoadingState, { variant: 'login' }))
  assert.match(login, /max-w-\[360px\] flex flex-col gap-2/)
  assert.match(login, /h-4 w-20/)
  assert.ok(login.includes(r.loading))
})
{
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
const screens = 'PaneManageSection WorkspacePickerView PanesView UsagePanel UsageDashboardAsync TimelineAsync'.split(' ')
test('screens use shared loading', () => {
  assert.match(src('./LoginForm.tsx'), /<LoginLoading\/>/)
  assert.match(src('./LoadingState.tsx'), /export function LoginLoading\(\)/)
  assert.match(src('./AsyncList.tsx'), /<LoadingState/)
  for (const f of screens) assert.match(src(`./${f}.tsx`), /<AsyncList/, f)
})
}
const root = new URL('..', import.meta.url)
const tsx = readdirSync(root, { recursive: true }).map(String).filter((f) => f.endsWith('.tsx'))
test('shared loading owns skeleton and text', () => {
  for (const f of tsx) {
    if (f === 'ui/LoadingRows.tsx' || f === 'ui/LoadingState.tsx') continue
    const s = readFileSync(new URL(f, root), 'utf8')
    assert.doesNotMatch(s, /animate-pulse|ListSkeleton|LoginSkeleton|skeleton=|>\s*\{r\.loading\}/, f)
  }
})
