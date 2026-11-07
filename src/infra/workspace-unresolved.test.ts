import test from'node:test'
import assert from'node:assert/strict'
import{sandbox}from'./workspace-resolve.test-util.js'
sandbox()
const{resolveWorkspace,readWorkspace}=await import('./workspace-resolve.js')
const{createLogger}=await import('./logger.js')
test('all sources fail: undefined and source names only in warning',async()=>{
 process.env.HERDR_BIN_PATH='/missing'
 let output=''
 const log=createLogger('warn',{write:s=>{output+=s}})
 assert.equal(await resolveWorkspace(undefined,()=>assert.fail('must not save'),log),undefined)
 assert.equal(readWorkspace(),undefined)
 const row=JSON.parse(output)
 assert.equal(row.msg,'workspace.unresolved')
 assert.deepEqual(row.sources,['ALLOWED_WORKSPACE_ID','workspace-selection.json','runtime.json','HERDR_WORKSPACE_ID','herdr workspace list'])
 assert.equal('id'in row,false)
})
