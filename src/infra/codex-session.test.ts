import test from'node:test'
import assert from'node:assert/strict'
import{mkdir,mkdtemp,rm,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{readCodexSession}from'./codex-session.js'
import{rec,key}from'./test-util/codex-session-record-fixture.js'
import{env,restore}from'./test-util/codex-session-env-fixture.js'
import{fakePs,env,restore}from'./test-util/codex-session-env-fixture.js'
import{realpath,rm}from'node:fs/promises'
import{readCodexSession,codexTranscriptPath}from'./codex-session.js'
import{sessionPath}from'./transcript-path.js'
import{setupRead}from'./test-util/codex-session-read-setup-fixture.js'
import{restore}from'./test-util/codex-session-env-fixture.js'
import{rm}from'node:fs/promises'
import{setupSymlinkEnv,restoreSymlinkEnv}from'./test-util/codex-session-symlink-env-fixture.js'
import{writeSymlinkRecords}from'./test-util/codex-session-symlink-records-fixture.js'

{
test('ignores a dead pid',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(file,'{}');await env(base,root)
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file,999999))
  assert.equal(await readCodexSession('w:p1'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
}
{
test('ignores a live pid whose command is not codex',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(file,'{}');await env(base,root);await fakePs(base,'node')
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file))
  assert.equal(await readCodexSession('w:p1'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
}
{
test('reads state and resolves transcript under codex root',async()=>{
 const{base,file,old}=await setupRead()
 try{
  assert.deepEqual(await readCodexSession('w:p1'),{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  const real=await realpath(file)
  assert.equal(await codexTranscriptPath('s1'),real)
  assert.equal(await sessionPath({agent:'codex',source:'biseo:codex',kind:'id',value:'s1'}),real)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
}
{
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
}
