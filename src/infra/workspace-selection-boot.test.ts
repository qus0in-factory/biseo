import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
import{sandbox}from'./workspace-resolve.test-util.js'
const put=sandbox()
const{resolveWorkspace}=await import('./workspace-resolve.js')
test('boot preserves UI selection through env override and legacy fallback',async()=>{
 const file='config/workspace-selection.json'
 put('config/runtime.json',{allowedWorkspaceId:'legacy'})
 put(file,{workspaceId:'ui',retained:true})
 const original=readFileSync(file,'utf8')
 process.env.ALLOWED_WORKSPACE_ID='env'
 assert.equal(await resolveWorkspace(),'env')
 assert.equal(readFileSync(file,'utf8'),original)
 delete process.env.ALLOWED_WORKSPACE_ID
 assert.equal(await resolveWorkspace(),'ui')
 assert.equal(readFileSync(file,'utf8'),original)
 put(file,{})
 assert.equal(await resolveWorkspace(),'legacy')
 assert.equal(readFileSync(file,'utf8'),'{}')
})
