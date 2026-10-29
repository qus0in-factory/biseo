import test from'node:test'
import assert from'node:assert/strict'
import{mkdir,mkdtemp,rm,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{readCodexSession}from'./codex-session.js'
import{rec,key}from'./codex-session-record-fixture.js'
import{fakePs,env,restore}from'./codex-session-env-fixture.js'
test('ignores a live pid whose command is not codex',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(file,'{}');await env(base,root);await fakePs(base,'node')
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file))
  assert.equal(await readCodexSession('w:p1'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})