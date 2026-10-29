import test from'node:test'
import assert from'node:assert/strict'
import {appendFile,mkdir,mkdtemp,rm}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {createCapture}from'./transcript-capture.js'
test('captures an antigravity response appended after begin',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-')),dir=join(base,'s1','.system_generated','logs')
 await mkdir(dir,{recursive:true})
 process.env.BISEO_ANTIGRAVITY_DIR=base
 try{
  const reader=await createCapture().begin({source:'herdr:antigravity_cli',agent:'agy',kind:'id',value:'s1'},'/tmp','hi')
  assert.ok(reader)
  await appendFile(join(dir,'transcript_full.jsonl'),[
   JSON.stringify({type:'USER_INPUT',source:'USER_EXPLICIT',content:'hi'}),
   JSON.stringify({type:'PLANNER_RESPONSE',content:'done',tool_calls:[]}),
  ].join('\n')+'\n')
  assert.equal(await reader.read(1000),'done')
 }finally{
  delete process.env.BISEO_ANTIGRAVITY_DIR
  await rm(base,{recursive:true,force:true})
 }
})
