import test from'node:test'
import assert from'node:assert/strict'
import{WorkspaceHerdr}from'./workspace-herdr.js'
import{HerdrCli}from'./herdr-cli.js'
import{checkTabWorkspace}from'./tab-workspace-check.js'
test('renameTab passes workspace check for matching tab',async()=>{
 const h=new WorkspaceHerdr()
 h.getTab=async()=>({tab_id:'t1',workspace_id:'w',label:null})
 await checkTabWorkspace(h,'t1','w')
})
test('queue input transport is independent of selected workspace',()=>{
 assert.equal(WorkspaceHerdr.prototype.prompt,HerdrCli.prototype.prompt)
})
