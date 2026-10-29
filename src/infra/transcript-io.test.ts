import test from'node:test'
import assert from'node:assert/strict'
import {appendFile,mkdtemp,rm,writeFile}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {readNew,sizeOf}from'./transcript-io.js'
test('readNew reads after offset on large JSONL and drops trailing partial line',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'biseo-io-')),file=join(dir,'large.jsonl')
 try{
  const line=JSON.stringify({type:'assistant',text:'x'.repeat(512)})+'\n'
  await writeFile(file,line.repeat(10000))
  const offset=await sizeOf(file)
  assert.ok(offset>5_000_000)
  const tail='{"ok":1}\n',part=Buffer.from('{"ko":"가나다"}\n','utf8')
  await appendFile(file,Buffer.concat([Buffer.from(tail),part.subarray(0,8)]))
  const first=await readNew(file,offset)
  assert.equal(first,tail)
  assert.ok(!first.includes('\ufffd'))
  await appendFile(file,part.subarray(8))
  assert.equal(await readNew(file,offset),tail+'{"ko":"가나다"}\n')
 }finally{await rm(dir,{recursive:true,force:true})}
})
