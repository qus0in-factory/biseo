import test from'node:test'
import assert from'node:assert/strict'
import {mkdir,mkdtemp,realpath,rm,symlink,writeFile}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {readCodexSession,codexTranscriptPath}from'./codex-session.js'
import {sessionPath}from'./transcript-path.js'
const rec=(id:string,p:string,pid=process.pid)=>JSON.stringify({session_id:id,transcript_path:p,pane_id:'x',pid,created_at:Date.now()})
const key=(pane:string)=>Buffer.from(pane).toString('hex')
async function fakePs(base:string,out='codex'){
 const dir=join(base,'psbin'),f=join(dir,'ps')
 await mkdir(dir,{recursive:true});await writeFile(f,`#!/bin/sh\necho '${out}'\n`,{mode:0o755})
 process.env.PATH=dir+':'+process.env.PATH
}
async function env(base:string,root:string){
 process.env.BISEO_STATE_DIR=join(base,'state');process.env.BISEO_CODEX_DIR=root
 await mkdir(join(base,'state','codex'),{recursive:true})
}
function restore(old:(string|undefined)[]){
 if(old[0]===undefined)delete process.env.BISEO_STATE_DIR;else process.env.BISEO_STATE_DIR=old[0]
 if(old[1]===undefined)delete process.env.BISEO_CODEX_DIR;else process.env.BISEO_CODEX_DIR=old[1]
 if(old[2]===undefined)delete process.env.PATH;else process.env.PATH=old[2]
}
test('reads state and resolves transcript under codex root',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'2026','rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(join(root,'2026'),{recursive:true});await writeFile(file,'{}');await env(base,root);await fakePs(base)
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file))
  assert.deepEqual(await readCodexSession('w:p1'),{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  const real=await realpath(file)
  assert.equal(await codexTranscriptPath('s1'),real)
  assert.equal(await sessionPath({agent:'codex',source:'biseo:codex',kind:'id',value:'s1'}),real)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
test('rejects symlink escape but allows a name beginning with ..',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),outside=join(base,'outside.jsonl'),link=join(root,'link.jsonl'),dot=join(root,'..rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(outside,'{}');await writeFile(dot,'{}');await symlink(outside,link);await env(base,root);await fakePs(base)
  const dir=join(base,'state','codex')
  await writeFile(join(dir,key('w:p1')+'.json'),rec('s1',link))
  await writeFile(join(dir,key('w:p2')+'.json'),rec('s2',dot))
  await writeFile(join(dir,key('w:p3')+'.json'),rec('s3','/etc/passwd'))
  await writeFile(join(dir,key('w:p4')+'.json'),'{bad')
  await writeFile(join(dir,key('w:p5')+'.json'),JSON.stringify({session_id:'s5',transcript_path:dot}))
  assert.equal(await readCodexSession('w:p1'),null)
  assert.deepEqual(await readCodexSession('w:p2'),{agent:'codex',kind:'id',source:'biseo:codex',value:'s2'})
  assert.equal(await codexTranscriptPath('s1'),null)
  assert.equal(await codexTranscriptPath('s3'),null)
  assert.equal(await readCodexSession('w:p3'),null)
  assert.equal(await readCodexSession('w:p4'),null)
  assert.equal(await readCodexSession('w:p5'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
test('ignores a live pid whose command is not codex',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(file,'{}');await env(base,root);await fakePs(base,'node')
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file))
  assert.equal(await readCodexSession('w:p1'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
test('ignores a dead pid',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 try{
  await mkdir(root,{recursive:true});await writeFile(file,'{}');await env(base,root)
  await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file,999999))
  assert.equal(await readCodexSession('w:p1'),null)
 }finally{restore(old);await rm(base,{recursive:true,force:true})}
})
