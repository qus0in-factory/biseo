import test from'node:test'
import assert from'node:assert/strict'
import{WorkspaceHerdr}from'./workspace-herdr.js'
test('renameTab rejects tab in other workspace',async()=>{
 const h=new WorkspaceHerdr()
 h.getTab=async()=>({tab_id:'t1',workspace_id:'other',label:null})
 await assert.rejects(()=>h.renameTab('t1','x'),(e:any)=>e?.code==='workspace_not_allowed')
})
test('renameTab rejects missing tab',async()=>{
 const h=new WorkspaceHerdr()
 h.getTab=async()=>undefined
 await assert.rejects(()=>h.renameTab('t1','x'),(e:any)=>e?.code==='workspace_not_allowed')
})
test('renameTab rejects when fallback panes lack tab',async()=>{
 const h=new WorkspaceHerdr()
 ;(h as{getTab?:unknown}).getTab=undefined
 h.listPanes=async()=>[]
 await assert.rejects(()=>h.renameTab('t1','x'),(e:any)=>e?.code==='workspace_not_allowed')
})
