import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{WorkspacePickerItem}from'./WorkspacePickerItem'
import r from'../resources.json'

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
