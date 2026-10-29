import test from'node:test'
import assert from'node:assert/strict'
import {appendFile,mkdir,mkdtemp,rm}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {createCapture}from'./transcript-capture.js'
test('begin exposes transcript input confirmation',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-')),cwd='/tmp/x',dir=join(base,'-tmp-x')
 await mkdir(dir)
 process.env.BISEO_CLAUDE_DIR=base
 try{
  const r=await createCapture().begin({source:'herdr:claude',agent:'claude',kind:'id',value:'s1'},cwd,'hi')
  assert.ok(r?.confirm)
  assert.equal(await r!.confirm!(),false)
  await appendFile(join(dir,'s1.jsonl'),JSON.stringify({type:'user',message:{content:'hi'}})+'\n')
  assert.equal(await r!.confirm!(),true)
 }finally{
  delete process.env.BISEO_CLAUDE_DIR
  await rm(base,{recursive:true,force:true})
 }
})
