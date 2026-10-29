import test from'node:test'
import assert from'node:assert/strict'
import{rm}from'node:fs/promises'
import{HerdrCli}from'./herdr-cli.js'
import{checkHerdrCli}from'./herdr-cli-codex-check-fixture.js'
import{setupHerdrCliEnv}from'./herdr-cli-codex-env-fixture.js'
import{restoreEnv}from'./env-restore-fixture.js'
import{writeHerdrCliFiles}from'./herdr-cli-codex-files-fixture.js'
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