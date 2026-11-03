import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{WorkspacePickerItem}from'./WorkspacePickerItem'
import r from'../resources.json'

test('Herdr focus and the biseo target have distinct labels',()=>{
 const render=(selected:boolean)=>renderToStaticMarkup(createElement(WorkspacePickerItem,{
  workspace:{workspaceId:'w1',label:'biseo',focused:true,paneCount:2},
  selected,loading:false,onSelect(){},
 }))
 const html=render(true)
 assert.ok(html.includes(r.workspaceSelected))
 assert.ok(html.includes(r.workspaceFocused))
 assert.notEqual(r.workspaceFocused,r.workspaceSelected)
 assert.match(r.workspaceFocused,/Herdr/)
 assert.ok(render(false).includes('<span class="sr-only"> biseo</span>'))
})
