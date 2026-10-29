import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import {call}from'./herdr-exec.js'
import {getAgent,getPane,listAgents,listPanes}from'./herdr-panes.js'
import {readRecent}from'./herdr-read.js'
import {sendKeys}from'./herdr-send.js'
import {promptArgs}from'./herdr-prompt-args.js'
export class HerdrCli{
 listPanes(ws:string):Promise<PaneInfo[]>{return listPanes(ws)}
 listAgents():Promise<AgentInfo[]>{return listAgents()}
 getPane(id:string){return getPane(id)}
 getAgent(id:string){return getAgent(id)}
 async prompt(id:string,text:string,timeoutMs:number,acceptanceMs?:number){
  await call(promptArgs(id,text,acceptanceMs),Math.min(timeoutMs+(acceptanceMs??0),60000))
 }
 sendKeys(id:string,keys:string){return sendKeys(id,keys)}
 readRecent(id:string,lines:number){return readRecent(id,lines)}
}
