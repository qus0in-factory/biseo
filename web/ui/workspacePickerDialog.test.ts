import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{WorkspacePickerDialog}from'./WorkspacePickerDialog'
import r from'../resources.json'

test('the entry dialog explains biseo selection and reuses the picker',()=>{
 const html=renderToStaticMarkup(createElement(WorkspacePickerDialog,{
  open:true,onClose(){},current:'w1X',select:async()=>null,
 }))
 assert.ok(html.includes(`aria-label="${r.workspaceSwitchTitle}"`))
 assert.ok(html.includes(r.workspaceSwitchHint))
 assert.ok(html.includes(r.workspacesTitle))
})
