import test from'node:test'
import assert from'node:assert/strict'
import{realpath,rm}from'node:fs/promises'
import{readCodexSession,codexTranscriptPath}from'./codex-session.js'
import{sessionPath}from'./transcript-path.js'
import{setupRead}from'./codex-session-read-setup-fixture.js'
import{restore}from'./codex-session-env-fixture.js'
test('reads state and resolves transcript under codex root',async()=>{
 const{base,file,old}=await setupRead()
 try{
  assert.deepEqual(await readCodexSession('w:p1'),{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  const real=await realpath(file)
  assert.equal(await codexTranscriptPath('s1'),real)
  assert.equal(await sessionPath({agent:'codex',source:'biseo:codex',kind:'id',value:'s1'}),real)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})