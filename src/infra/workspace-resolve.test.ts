import test from'node:test'
import assert from'node:assert/strict'
import{sandbox}from'./workspace-resolve.test-util.js'
const put=sandbox()
const{resolveWorkspace,readWorkspace}=await import('./workspace-resolve.js')
test('sources resolve in order and persist; focus is fixed after boot',async()=>{
 process.env.ALLOWED_WORKSPACE_ID='env'
 process.env.HERDR_WORKSPACE_ID='pane'
 put('config/runtime.json',{allowedWorkspaceId:'legacy'})
 put('config/workspace-selection.json',{workspaceId:'selected'})
 for(const id of ['env','selected','legacy','pane','focused']){
  assert.equal(await resolveWorkspace(),id)
  if(id==='env')delete process.env.ALLOWED_WORKSPACE_ID
  if(id==='legacy')put('config/runtime.json',{})
  if(id==='selected')put('config/workspace-selection.json',{})
  if(id==='pane')delete process.env.HERDR_WORKSPACE_ID
 }
 process.env.HERDR_BIN_PATH='/missing'
 assert.equal(readWorkspace(),'focused')
})
