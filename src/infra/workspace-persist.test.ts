import test from'node:test'
import assert from'node:assert/strict'
import{sandbox}from'./workspace-resolve.test-util.js'
sandbox()
const{resolveWorkspace,readWorkspace}=await import('./workspace-resolve.js')
const{readSelectedWorkspace,writeSelectedWorkspace}=await import('./workspace-selection.js')
test('boot result persists and explicit UI selection updates the pinned scope',async()=>{
 process.env.ALLOWED_WORKSPACE_ID='first'
 await resolveWorkspace()
 assert.equal(readSelectedWorkspace(),'first')
 process.env.ALLOWED_WORKSPACE_ID='later'
 assert.equal(readWorkspace(),'first')
 writeSelectedWorkspace('ui')
 assert.equal(readWorkspace(),'ui')
 assert.equal(readSelectedWorkspace(),'ui')
})
