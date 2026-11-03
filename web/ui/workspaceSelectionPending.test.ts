import test from'node:test'
import assert from'node:assert/strict'
import{selectWorkspaceAndRefresh}from'./workspacePickerSelect'
import{isWorkspaceSelectionPending}from'./workspaceSelectionGuard'

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
