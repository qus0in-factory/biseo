import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { WorkspacePickerItem } from './WorkspacePickerItem'
import assert from 'node:assert/strict'

test('workspace selection is exposed through aria current', () => {
  for (const selected of [true, false]) {
    const out = renderToStaticMarkup(createElement(WorkspacePickerItem, {
      workspace: { workspaceId: 'w1' }, selected, loading: false, onSelect() {},
    }))
    assert.equal(out.includes('aria-current="true"'), selected)
    assert.equal(out.includes(r.workspaceSelect), !selected)
  }
})

test('workspace item retains its full name and metadata', () => {
  const name = 'Factory Production Coordination Workspace'
  const out = renderToStaticMarkup(createElement(WorkspacePickerItem, {
    workspace: { workspaceId: 'w1', label: name, focused: true, paneCount: 8 },
    selected: false, loading: false, onSelect() {},
  }))
  assert.ok(out.includes(`title="${name}"`))
  assert.ok(out.includes(r.workspaceFocused))
  assert.ok(out.includes(`${r.panesTitle}: 8`))
})

test('workspace focus and connection have distinct user-facing labels',()=>{
 const render=(selected:boolean)=>renderToStaticMarkup(createElement(WorkspacePickerItem,{
  workspace:{workspaceId:'w1',label:'biseo',focused:true,paneCount:2},
  selected,loading:false,onSelect(){},
 }))
 const html=render(true)
 assert.ok(html.includes(r.workspaceSelected))
 assert.ok(html.includes(r.workspaceFocused))
 assert.notEqual(r.workspaceFocused,r.workspaceSelected)
 assert.equal(r.workspaceFocused,'현재 작업 중')
 assert.equal(r.workspaceSelected,'연결됨')
 assert.doesNotMatch(r.workspaceFocused + r.workspaceSelected,/Herdr|biseo/)
 assert.ok(render(false).includes('<span class="sr-only"> biseo</span>'))
})
