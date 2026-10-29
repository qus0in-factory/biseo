import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{HerdrPort}from'../app/ports.js'
import {call,notFound}from'./herdr-exec.js'
import {withCodex,withCodexAll}from'./herdr-codex.js'
export class HerdrCli implements HerdrPort{
 async listPanes(ws:string){const r=await call(['pane','list','--workspace',ws],15000);return withCodexAll((r.result?.panes??[]) as PaneInfo[])}
 async listAgents(){const r=await call(['agent','list'],15000);return withCodexAll((r.result?.agents??[]) as AgentInfo[])}
 async getPane(id:string){try{const r=await call(['pane','get',id],15000);return withCodex(r.result?.pane as PaneInfo|undefined)}catch(e){if(notFound(e))return;throw e}}
 async getAgent(id:string){try{const r=await call(['agent','get',id],15000);return withCodex(r.result?.agent as AgentInfo|undefined)}catch(e){if(notFound(e))return;throw e}}
 async prompt(id:string,text:string,timeoutMs:number){
  await call(['agent','prompt',id,text],Math.min(timeoutMs,15000))
 }
}
