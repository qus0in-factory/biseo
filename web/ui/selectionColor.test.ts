import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspacePickerItem } from './WorkspacePickerItem'
import { paneSelectClass, paneSelectTarget } from './paneSelectClass'

test('selection changes fill, not ring or border; workspace aria is kept', () => {
 const html = renderToStaticMarkup(createElement(WorkspacePickerItem, {
  workspace: { workspaceId: 'w1' }, selected: true, loading: false, onSelect() {},
 }))
 assert.match(html, /bg-muted/)
 assert.match(html, /aria-current="true"/)
 assert.ok(!html.includes('ring-'))
 assert.match(paneSelectClass(true), /bg-primary\/15/)
 const borders = (active: boolean) => paneSelectClass(active).split(' ').filter(c => c.startsWith('border'))
 assert.deepEqual(borders(true), borders(false))
 assert.match(paneSelectTarget, /focus-visible:outline-2/)
})
