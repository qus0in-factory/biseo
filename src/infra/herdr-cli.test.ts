import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync,readFileSync,rmSync,writeFileSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {HerdrCli}from'./herdr-cli.js'
import { mkBin, readArgs, rmBin, scriptEcho } from './herdr-cli-fixture.js'
import{rm}from'node:fs/promises'
import{checkHerdrCli}from'./herdr-cli-codex-check-fixture.js'
import{setupHerdrCliEnv}from'./herdr-cli-codex-env-fixture.js'
import{restoreEnv}from'./env-restore-fixture.js'
import{writeHerdrCliFiles}from'./herdr-cli-codex-files-fixture.js'
import { expectedRead, expectedSendKeys, mkBin, readArgs, rmBin, scriptRead } from './herdr-cli-fixture.js'

{
test('acceptance wait args follow the prompt text',async()=>{
 const d=mkdtempSync(join(tmpdir(),'b-')),b=join(d,'h'),a=join(d,'a')
 writeFileSync(b,'#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\necho \'{}\'\n',{mode:0o755})
 const old=process.env.HERDR_BIN_PATH
 process.env.HERDR_BIN_PATH=b;process.env.ARGS_FILE=a
 try{
  await new HerdrCli().prompt('w:p1','hi',15000,8000)
  assert.deepEqual(readFileSync(a,'utf8').trim().split('\n'),['agent','prompt','w:p1','hi','--wait','--until','working','--until','blocked','--timeout','8000'])
 }finally{
  if(old===undefined)delete process.env.HERDR_BIN_PATH;else process.env.HERDR_BIN_PATH=old
  delete process.env.ARGS_FILE
  rmSync(d,{recursive:true,force:true})
 }
})
}
{

test('canonical args keep hyphen text positional', async () => {
  const { dir, bin, args } = mkBin(scriptEcho)
  const old = process.env.HERDR_BIN_PATH
  process.env.HERDR_BIN_PATH = bin
  process.env.ARGS_FILE = args
  try {
    for (const text of ['-hello', '--wait']) {
      await new HerdrCli().prompt('w:p1', text, 15000)
      assert.deepEqual(readArgs(args), ['agent', 'prompt', 'w:p1', text])
    }
  } finally {
    if (old === undefined) delete process.env.HERDR_BIN_PATH
    else process.env.HERDR_BIN_PATH = old
    delete process.env.ARGS_FILE
    rmBin(dir)
  }
})
}
{
test('augments codex panes from biseo state without overwriting sessions',async()=>{
 const ctx=await setupHerdrCliEnv()
 await writeHerdrCliFiles(ctx)
 const{old}=ctx
 try{
  const h=new HerdrCli(),ps=await h.listPanes('w'),as=await h.listAgents()
  checkHerdrCli(ps,as,(await h.getPane('w:p1'))?.agent_session,(await h.getAgent('w:p1'))?.agent_session)
 }finally{
  restoreEnv(old,['HERDR_BIN_PATH','BISEO_STATE_DIR','BISEO_CODEX_DIR','PATH'])
  await rm(ctx.base,{recursive:true,force:true})
 }
})
}
{

test('sends allowlisted keys and reads only recent plain-text lines', async () => {
  const { dir, bin, args } = mkBin(scriptRead)
  const old = [process.env.HERDR_BIN_PATH, process.env.ARGS_FILE]
  process.env.HERDR_BIN_PATH = bin
  process.env.ARGS_FILE = args
  try {
    await new HerdrCli().sendKeys('w:p1', 'esc')
    assert.deepEqual(readArgs(args), expectedSendKeys)
    const lines = await new HerdrCli().readRecent('w:p1', 8)
    assert.deepEqual(lines, ['one', 'two'])
    assert.deepEqual(readArgs(args), expectedRead)
  } finally {
    if (old[0] === undefined) delete process.env.HERDR_BIN_PATH
    else process.env.HERDR_BIN_PATH = old[0]
    if (old[1] === undefined) delete process.env.ARGS_FILE
    else process.env.ARGS_FILE = old[1]
    rmBin(dir)
  }
})
}
