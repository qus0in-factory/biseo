import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { PaneStatusSummary } from './PaneStatusSummary'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { metaPane } from '../test-util/paneMetaFixture'
test('status summary does not repeat the loading text above the list skeleton', () => {
  const out = renderToStaticMarkup(createElement(PaneStatusSummary, {
    panes: [],
    state: { status: 'loading' },
  }))
  assert.equal(out, '')
})
test('compact summary omits zero visually but keeps all six accessible counts', () => {
  const panes = [metaPane(null)]
  const out = render(h(PaneStatusSummary, { panes, state: { status: 'ready', data: panes } }))
  const [accessible, visible] = out.split('<div aria-hidden="true"')
  assert.equal((accessible.match(/font-semibold/g) ?? []).length, 6)
  assert.match(accessible, /알 수 없음 0/)
  assert.match(accessible, /입력 필요 0/)
  assert.equal((visible.match(/font-semibold/g) ?? []).length, 1)
  assert.match(visible, /대기 1/)
  assert.match(visible, /md:flex-nowrap/)
  assert.match(visible, /whitespace-nowrap/)
})
