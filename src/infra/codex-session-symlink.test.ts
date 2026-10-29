import test from'node:test'
import assert from'node:assert/strict'
import{rm}from'node:fs/promises'
import{readCodexSession,codexTranscriptPath}from'./codex-session.js'
import{setupSymlinkEnv,restoreSymlinkEnv}from'./codex-session-symlink-env-fixture.js'
import{writeSymlinkRecords}from'./codex-session-symlink-records-fixture.js'
test('rejects symlink escape but allows a name beginning with ..',async()=>{
 const{base:b}=await setupSymlinkEnv()
 try{
  await writeSymlinkRecords(b)
  assert.equal(await readCodexSession('w:p1'),null)
  assert.deepEqual(await readCodexSession('w:p2'),{agent:'codex',kind:'id',source:'biseo:codex',value:'s2'})
  assert.equal(await codexTranscriptPath('s1'),null)
  assert.equal(await codexTranscriptPath('s3'),null)
  assert.equal(await readCodexSession('w:p3'),null)
  assert.equal(await readCodexSession('w:p4'),null)
  assert.equal(await readCodexSession('w:p5'),null)
 }finally{restoreSymlinkEnv();await rm(b,{recursive:true,force:true})}
})