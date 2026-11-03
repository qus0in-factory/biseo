import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspacePickerView } from './WorkspacePickerView'
import { listState } from '../domain/asyncListState'
import r from '../resources.json'
import { beginWorkspaceSelection } from './workspaceSelectionGuard'
import { subscribeWorkspaceSelection } from './workspaceSelectionGuard'
import { missingWorkspaceNotice } from './workspacePickerNotice'
test('workspace empty is success-only; failure has retry, not empty', () => {
 const render = (loading: boolean, error: string | null) => renderToStaticMarkup(createElement(WorkspacePickerView, {
  state: listState([], loading, error), current: null, loading, notice: null, onSelect() {}, onRetry() {},
 }))
 assert.ok(!render(true, null).includes(r.workspacesEmpty))
 assert.ok(render(false, null).includes(r.workspacesEmpty))
 const failed = render(false, 'connection_unavailable')
 assert.ok(!failed.includes(r.workspacesEmpty))
 assert.ok(failed.includes(r.workspacesError))
 assert.ok(failed.includes(r.retry))
})
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
