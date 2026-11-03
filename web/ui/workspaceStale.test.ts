import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{listState}from'../domain/asyncListState'
import{WorkspacePickerView}from'./WorkspacePickerView'
import{missingWorkspaceNotice}from'./workspacePickerNotice'
import r from'../resources.json'
const notice=missingWorkspaceNotice

test('a missing fixture selection asks for reselection',()=>{
 const items=[{workspaceId:'w1X'}]
 assert.equal(notice('w',items,false,null),r.workspaceUnavailable)
 assert.equal(notice('w1X',items,false,null),null)
 assert.equal(notice('w',items,true,null),null)
 assert.equal(notice('w',items,false,'connection_unavailable'),null)
})

test('missing selection alert renders in the list',()=>{
 const items=[{workspaceId:'w1X'}]
 const html=renderToStaticMarkup(createElement(WorkspacePickerView,{
  state:listState(items,false,null),current:'w',loading:false,
  notice:notice('w',items,false,null),onSelect(){},onRetry(){},
 }))
 assert.ok(html.includes(`role="alert">${r.workspaceUnavailable}`))
})
