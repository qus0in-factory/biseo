import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync,rmSync,writeFileSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {codexPid}from'./codex-pid.js'
function fakePs(out:string){
 const b=mkdtempSync(join(tmpdir(),'biseo-ps-')),f=join(b,'ps')
 writeFileSync(f,`#!/bin/sh\necho '${out}'\n`,{mode:0o755})
 return {b,f}
}
test('accepts a live codex pid and rejects another command',()=>{
 const {b,f}=fakePs('codex'),old=process.env.PATH
 process.env.PATH=b+':'+old
 try{
  assert.equal(codexPid(process.pid),true)
  writeFileSync(f,'#!/bin/sh\necho node\n',{mode:0o755})
  assert.equal(codexPid(process.pid),false)
 }finally{
  process.env.PATH=old
  rmSync(b,{recursive:true,force:true})
 }
})
test('rejects a dead pid',()=>{
 assert.equal(codexPid(999999),false)
})
