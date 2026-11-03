import test from'node:test'
import assert from'node:assert/strict'
import{DatabaseSync}from'node:sqlite'
import{mkdtempSync,writeFileSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{recentOpencode}from'./recent-opencode.js'
test('saved opencode response requires successful idle completion',()=>{
 const dir=mkdtempSync(tmpdir()+'/recent-'),path=dir+'/db'
 const db=new DatabaseSync(path)
 db.exec('CREATE TABLE session_message(session_id,type,seq,data)')
 process.env.BISEO_OPENCODE_DB=path
 try{
  const write=db.prepare('INSERT INTO session_message VALUES(?,?,?,?)')
  write.run('ses_a','user',1,'{"text":"hi"}')
  write.run('ses_a','assistant',2,'{"content":"done"}')
  assert.equal(recentOpencode('ses_a'),null)
  write.run('ses_a','idle',3,'{"outcome":"succeeded"}')
  assert.deepEqual(recentOpencode('ses_a'),{promptText:'hi',responseText:'done'})
 }finally{db.close();delete process.env.BISEO_OPENCODE_DB;rmSync(dir,{recursive:true})}
})
test('missing history is empty but corrupt storage propagates an error',()=>{
 const dir=mkdtempSync(tmpdir()+'/recent-error-'),path=dir+'/db'
 process.env.BISEO_OPENCODE_DB=path
 try{
  assert.equal(recentOpencode('ses_a'),null)
  writeFileSync(path,'not a database')
  assert.throws(()=>recentOpencode('ses_a'))
 }finally{delete process.env.BISEO_OPENCODE_DB;rmSync(dir,{recursive:true})}
})
