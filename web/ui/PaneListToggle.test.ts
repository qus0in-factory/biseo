import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneListToggle } from './PaneListToggle'
import { usePaneListStore } from '../app/paneListStore'

test('one fold toggle changes state without count or bound controls', () => {
  const folded = renderToStaticMarkup(createElement(PaneListToggle))
  assert.equal((folded.match(/<button/g) ?? []).length, 1)
  assert.match(folded, /aria-expanded="false"/)
  usePaneListStore.getState().toggle()
  assert.equal(usePaneListStore.getState().expanded, true)
  usePaneListStore.getState().toggle()
  assert.equal(usePaneListStore.getState().expanded, false)
})
