import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync,readFileSync,rmSync,writeFileSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {HerdrCli}from'./herdr-cli.js'
test('canonical args keep hyphen text positional',async()=>{
 const d=mkdtempSync(join(tmpdir(),'b-')),b=join(d,'h'),a=join(d,'a')
 writeFileSync(b,'#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\necho \'{}\'\n',{mode:0o755})
 const old=process.env.HERDR_BIN_PATH
 process.env.HERDR_BIN_PATH=b;process.env.ARGS_FILE=a
 try{
  for(const text of ['-hello','--wait']){
   await new HerdrCli().prompt('w:p1',text,100)
   assert.deepEqual(readFileSync(a,'utf8').trim().split('\n'),['agent','prompt','w:p1',text,'--wait','--timeout','100'])
  }
 }finally{
  if(old===undefined)delete process.env.HERDR_BIN_PATH;else process.env.HERDR_BIN_PATH=old
  delete process.env.ARGS_FILE
  rmSync(d,{recursive:true,force:true})
 }
})
