import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { PaneStatusSummary } from './PaneStatusSummary'
import { metaPane } from './paneMetaFixture.test-util'

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
