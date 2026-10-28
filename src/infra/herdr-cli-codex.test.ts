import test from'node:test'
import assert from'node:assert/strict'
import {mkdir,mkdtemp,rm,writeFile}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {HerdrCli}from'./herdr-cli.js'
const sess=(source:string,value:string)=>({source,agent:'codex',kind:'id',value})
const pane=(id:string,agent:string,session?:object)=>({pane_id:id,tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle',agent,revision:1,...(session?{agent_session:session}:{})})
const agent=(id:string,kind:string)=>({pane_id:id,terminal_id:'term',agent_status:'idle',agent:kind,revision:1})
test('augments codex panes from biseo state without overwriting sessions',async()=>{
 const base=await mkdtemp(join(tmpdir(),'biseo-herdr-')),state=join(base,'state'),root=join(base,'sessions'),bin=join(base,'herdr'),psdir=join(base,'ps')
 const panes=[pane('w:p1','codex'),pane('w:p2','claude',sess('herdr:claude','c1')),pane('w:p3','codex',sess('herdr:codex','old')),pane('w:p4','codex')]
 const agents=[agent('w:p1','codex'),agent('w:p2','claude'),agent('w:p3','codex')]
 const body=[['pane list',JSON.stringify({result:{panes}})],['agent list',JSON.stringify({result:{agents}})],['pane get',JSON.stringify({result:{pane:panes[0]}})],['agent get',JSON.stringify({result:{agent:agents[0]}})]]
  .map(([k,v])=>`  "${k}") echo '${v}';;`).join('\n')
 await mkdir(join(state,'codex'),{recursive:true});await mkdir(root,{recursive:true});await mkdir(psdir,{recursive:true})
 await writeFile(join(root,'rollout.jsonl'),'{}')
 const rec=(id:string)=>JSON.stringify({session_id:id,transcript_path:join(root,'rollout.jsonl'),pid:process.pid,created_at:Date.now()})
 await writeFile(join(psdir,'ps'),'#!/bin/sh\necho codex\n',{mode:0o755})
 await writeFile(join(state,'codex',Buffer.from('w:p1').toString('hex')+'.json'),rec('s1'))
 await writeFile(join(state,'codex',Buffer.from('w:p3').toString('hex')+'.json'),rec('s3'))
 await writeFile(bin,`#!/bin/sh\ncase "$1 $2" in\n${body}\n  *) echo '{}';;\nesac\n`,{mode:0o755})
 const old=[process.env.HERDR_BIN_PATH,process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 process.env.HERDR_BIN_PATH=bin;process.env.BISEO_STATE_DIR=state;process.env.BISEO_CODEX_DIR=root;process.env.PATH=psdir+':'+process.env.PATH
 try{
  const h=new HerdrCli(),ps=await h.listPanes('w'),as=await h.listAgents()
  assert.deepEqual(ps[0].agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  assert.equal(ps[1].agent_session?.source,'herdr:claude')
  assert.equal(ps[2].agent_session?.value,'old')
  assert.equal(ps[3].agent_session,undefined)
  assert.deepEqual(as[0].agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  assert.deepEqual((await h.getPane('w:p1'))?.agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
  assert.deepEqual((await h.getAgent('w:p1'))?.agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
 }finally{
  if(old[0]===undefined)delete process.env.HERDR_BIN_PATH;else process.env.HERDR_BIN_PATH=old[0]
  if(old[1]===undefined)delete process.env.BISEO_STATE_DIR;else process.env.BISEO_STATE_DIR=old[1]
  if(old[2]===undefined)delete process.env.BISEO_CODEX_DIR;else process.env.BISEO_CODEX_DIR=old[2]
  if(old[3]===undefined)delete process.env.PATH;else process.env.PATH=old[3]
  await rm(base,{recursive:true,force:true})
 }
})
