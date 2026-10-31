import test from'node:test'
import assert from'node:assert/strict'
import{WorkspaceHerdr}from'./workspace-herdr.js'
test('renameTab passes workspace check for matching tab',async()=>{
 const h=new WorkspaceHerdr()
 h.getTab=async()=>({tab_id:'t1',workspace_id:'w',label:null})
 try{await h.renameTab('t1','x')}catch(e:any){
  assert.notEqual(e?.code,'workspace_not_allowed')
 }
})
