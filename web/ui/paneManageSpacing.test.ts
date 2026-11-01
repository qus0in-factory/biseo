import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneManageSection } from './PaneManageSection'

const src = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')

test('panel manage skeleton and list share the button gap', () => {
  const html = renderToStaticMarkup(createElement(PaneManageSection, { onAdd() {} }))
  assert.match(html, /class="pane-manage-skeleton"/)
  assert.match(src('./settings-panels.css'), /\.pane-manage-skeleton \{ margin-top: 1rem; \}/)
  assert.match(src('./settings-panels.css'), /\.pane-manage-list > li \{ padding-block: \.5rem; \}/)
  assert.match(src('./PaneManageList.tsx'), /<ul className="pane-manage-list">/)
})
