import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneManageSection } from './PaneManageSection'
import { WorkspacePicker } from './WorkspacePicker'
import { workspaceApi } from '../infra/workspaceApi'
import r from '../resources.json'
import { readFileSync } from 'node:fs'
import { assertPanelGrid } from '../test-util/paneManageLayout'
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
const src = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')

test('panel manage skeleton uses the common list spacing', () => {
  const html = renderToStaticMarkup(createElement(PaneManageSection, { onAdd() {} }))
  assert.match(html, /class="mt-4 flex flex-col gap-2"/)
  assert.doesNotMatch(html, /pane-manage-skeleton/)
  assert.match(src('./settings-panels.css'), /\.pane-manage-list > li \{ padding-block: \.5rem; \}/)
  assert.match(src('./PaneManageList.tsx'), /<ul className="pane-manage-list">/)
})

test('settings panel list cannot overflow the modal and keeps the name visible', () => {
  const css = src('./settings-panels.css')
  assertPanelGrid(css)
  assert.match(src('./Modal.tsx'), /min-w-0 overflow-y-auto overflow-x-hidden/)
})
