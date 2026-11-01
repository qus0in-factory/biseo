import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoadingState } from './LoadingState'
import r from '../resources.json'

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
