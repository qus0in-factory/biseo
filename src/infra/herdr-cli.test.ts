import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync,readFileSync,rmSync,writeFileSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {HerdrCli}from'./herdr-cli.js'
test('sends allowlisted keys and reads only recent plain-text lines',async()=>{
 const d=mkdtempSync(join(tmpdir(),'b-')),b=join(d,'h'),a=join(d,'a')
 writeFileSync(b,'#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\nif [ "$1 $2" = "pane read" ]; then printf \'one\\ntwo\\n\'; else echo \'{}\'; fi\n',{mode:0o755})
 const old=[process.env.HERDR_BIN_PATH,process.env.ARGS_FILE]
 process.env.HERDR_BIN_PATH=b;process.env.ARGS_FILE=a
 try{
  await new HerdrCli().sendKeys('w:p1','esc')
  assert.deepEqual(readFileSync(a,'utf8').trim().split('\n'),['pane','send-keys','w:p1','esc'])
  const lines=await new HerdrCli().readRecent('w:p1',8)
  assert.deepEqual(lines,['one','two'])
  assert.deepEqual(readFileSync(a,'utf8').trim().split('\n'),['pane','read','w:p1','--source','recent','--lines','8','--format','text'])
 }finally{
  if(old[0]===undefined)delete process.env.HERDR_BIN_PATH;else process.env.HERDR_BIN_PATH=old[0]
  if(old[1]===undefined)delete process.env.ARGS_FILE;else process.env.ARGS_FILE=old[1]
  rmSync(d,{recursive:true,force:true})
 }
})
test('canonical args keep hyphen text positional',async()=>{
 const d=mkdtempSync(join(tmpdir(),'b-')),b=join(d,'h'),a=join(d,'a')
 writeFileSync(b,'#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\necho \'{}\'\n',{mode:0o755})
 const old=process.env.HERDR_BIN_PATH
 process.env.HERDR_BIN_PATH=b;process.env.ARGS_FILE=a
 try{
  for(const text of ['-hello','--wait']){
   await new HerdrCli().prompt('w:p1',text,15000)
   assert.deepEqual(readFileSync(a,'utf8').trim().split('\n'),['agent','prompt','w:p1',text])
  }
 }finally{
  if(old===undefined)delete process.env.HERDR_BIN_PATH;else process.env.HERDR_BIN_PATH=old
  delete process.env.ARGS_FILE
  rmSync(d,{recursive:true,force:true})
 }
})
