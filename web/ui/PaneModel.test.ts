import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneModel } from './PaneModel'
import { paneModelLabel } from './PaneModel'
import { observedPanes } from '../test-util/usage-panel-fixture'

test('missing model omits the repeated placeholder and decorative icon', () => {
  const render = () => renderToStaticMarkup(createElement(PaneModel, {
    item: { ...observedPanes[0], modelId: null },
  }))
  assert.equal(render(), '')
  assert.equal(paneModelLabel({ ...observedPanes[0], modelId: null }), null)
  assert.equal(paneModelLabel({ ...observedPanes[0], modelId: '  ' }), null)
  assert.equal(paneModelLabel({ ...observedPanes[0], modelId: ' gpt-5 ' }), 'gpt-5')
})
