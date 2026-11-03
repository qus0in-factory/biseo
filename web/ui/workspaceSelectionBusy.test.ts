import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{listState}from'../domain/asyncListState'
import{WorkspacePickerView}from'./WorkspacePickerView'
import{beginWorkspaceSelection,subscribeWorkspaceSelection}from'./workspaceSelectionGuard'

test('both mounted pickers disable selection while a selection is pending',()=>{
 let updates=0
 const stop=subscribeWorkspaceSelection(()=>{updates++})
 const release=beginWorkspaceSelection()
 assert.ok(release)
 assert.equal(updates,1)
 const view=(id:string)=>renderToStaticMarkup(createElement(WorkspacePickerView,{
  state:listState([{workspaceId:id}],false,null),current:'w1',loading:false,notice:null,
  onSelect(){},onRetry(){},
 }))
 const main=view('w2')
 const settings=view('w3')
 assert.match(main,/disabled=""/)
 assert.match(settings,/disabled=""/)
 assert.match(main,/aria-busy="true"/)
 release()
 assert.equal(updates,2)
 stop()
})
