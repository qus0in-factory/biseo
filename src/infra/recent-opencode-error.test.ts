import test from'node:test'
import assert from'node:assert/strict'
import{mkdtempSync,writeFileSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{recentOpencode}from'./recent-opencode.js'
test('missing history is empty but corrupt storage propagates an error',()=>{
 const dir=mkdtempSync(tmpdir()+'/recent-error-'),path=dir+'/db'
 process.env.BISEO_OPENCODE_DB=path
 try{
  assert.equal(recentOpencode('ses_a'),null)
  writeFileSync(path,'not a database')
  assert.throws(()=>recentOpencode('ses_a'))
 }finally{delete process.env.BISEO_OPENCODE_DB;rmSync(dir,{recursive:true})}
})
