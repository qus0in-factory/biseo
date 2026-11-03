import test from 'node:test'
import assert from 'node:assert/strict'
import { runSelection } from '../test-util/workspacePickerTestUtil'
import { selectWorkspaceAndRefresh } from './workspacePickerSelect'
import { isWorkspaceSelectionPending } from './workspaceSelectionGuard'
test('success applies the response and refreshes the list',async()=>{
 const log:string[]=[]
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w2'}),log),{workspaceId:'w2'})
 assert.deepEqual(log,['loading:true','error:null','current:w2','notice:null','selected:w2','reload','loading:false'])
})

test('stale null is ignored without an error or current change',async()=>{
 const log:string[]=[]
 assert.equal(await runSelection(async()=>null,log),null)
 assert.deepEqual(log,['loading:true','error:null','loading:false'])
})
test('failure keeps the current selection and exposes the connection error',async()=>{
 const log:string[]=[]
 assert.equal(await runSelection(async()=>{throw new Error('offline')},log),null)
 assert.deepEqual(log,['loading:true','error:null','error:connection_unavailable','loading:false'])
})
const handlers=()=>({setLoading(){},setError(){},setCurrent(){},setNotice(){},reload(){}})

test('a pending picker blocks a second picker or reopened picker call',async()=>{
 let calls=0
 let release!:()=>void
 const hold=new Promise<void>(resolve=>{release=resolve})
 const select=async()=>{calls++;await hold;return{workspaceId:'w2'}}
 const first=selectWorkspaceAndRefresh(select,'w2',handlers())
 assert.equal(isWorkspaceSelectionPending(),true)
 assert.equal(await selectWorkspaceAndRefresh(select,'w3',handlers()),null)
 assert.equal(await selectWorkspaceAndRefresh(select,'w4',handlers()),null)
 assert.equal(calls,1)
 release()
 assert.deepEqual(await first,{workspaceId:'w2'})
 assert.equal(isWorkspaceSelectionPending(),false)
})
test('resolve and rejection release the guard so retry is allowed',async()=>{
 const log:string[]=[]
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w2'}),log),{workspaceId:'w2'})
 assert.equal(isWorkspaceSelectionPending(),false)
 assert.equal(await runSelection(async()=>{throw new Error('offline')},log),null)
 assert.equal(isWorkspaceSelectionPending(),false)
 assert.deepEqual(await runSelection(async()=>({workspaceId:'w3'}),log),{workspaceId:'w3'})
})
