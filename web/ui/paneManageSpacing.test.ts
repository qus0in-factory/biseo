import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneManageSection } from './PaneManageSection'

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
  assert.match(css, /\.settings-content > \*, \.settings-content \[role=tablist\] \{ min-width: 0; max-width: 100%; \}/)
  assert.match(css, /\.pane-manage-head \{[^}]*flex-wrap: wrap/)
  assert.match(css, /\.pane-manage-name \{ flex: 1 1 8rem; min-width: 0/)
  assert.match(css, /section > \[role=status\] \{ margin-block: \.5rem; \}/)
  assert.match(src('./Modal.tsx'), /min-w-0 overflow-y-auto overflow-x-hidden/)
})
