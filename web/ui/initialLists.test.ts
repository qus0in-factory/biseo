import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneManageSection } from './PaneManageSection'
import { WorkspacePicker } from './WorkspacePicker'
import { workspaceApi } from '../infra/workspaceApi'
import r from '../resources.json'

test('panel management and workspace picker render skeletons before effects', () => {
 for (const element of [
  createElement(PaneManageSection, { onAdd() {} }),
  createElement(WorkspacePicker, { api: workspaceApi }),
 ]) {
  const html = renderToStaticMarkup(element)
  assert.match(html, /aria-busy="true"/)
  assert.ok(!html.includes(r.paneManageEmpty))
  assert.ok(!html.includes(r.workspacesEmpty))
  assert.ok(!html.includes('role="alert"'))
 }
})
