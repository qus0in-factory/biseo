import test from'node:test'
import assert from'node:assert/strict'
import {appendFile,mkdir,mkdtemp,rm}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {createCapture}from'./transcript-capture.js'
test('captures a response appended after begin',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-')),cwd='/tmp/x',dir=join(base,'-tmp-x')
 await mkdir(dir)
 process.env.BISEO_CLAUDE_DIR=base
 try{
  const reader=await createCapture().begin({source:'herdr:claude',agent:'claude',kind:'id',value:'s1'},cwd,'hi')
  assert.ok(reader)
  await appendFile(join(dir,'s1.jsonl'),[
   JSON.stringify({type:'user',message:{content:'hi'}}),
   JSON.stringify({type:'assistant',message:{stop_reason:'end_turn',content:[{type:'text',text:'done'}]}}),
  ].join('\n')+'\n')
  assert.equal(await reader.read(1000),'done')
 }finally{
  delete process.env.BISEO_CLAUDE_DIR
  await rm(base,{recursive:true,force:true})
 }
})
