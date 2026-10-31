import type{AgentInfo,AgentSession,PaneInfo,WorkspaceInfo}from'../domain/herdr.js'
import type{Availability}from'../domain/timeline.js'
export interface AvailabilityPort{get(session:AgentSession|undefined,now?:Date):Promise<Availability>;ttlMs?:number}
export interface HerdrPort{
 listPanes(ws:string):Promise<PaneInfo[]>
 listAgents():Promise<AgentInfo[]>
 listWorkspaces?():Promise<WorkspaceInfo[]>
 getPane(id:string):Promise<PaneInfo|undefined>
 getAgent(id:string):Promise<AgentInfo|undefined>
 prompt(id:string,text:string,timeoutMs:number,acceptanceMs?:number):Promise<void>
 sendKeys?(id:string,keys:string):Promise<void>
 readRecent?(id:string,lines:number):Promise<string[]>
}
export type CaptureReader={read(graceMs:number):Promise<string|null>;confirm?():Promise<boolean>;close?():void}
export interface CapturePort{begin(session:AgentSession|undefined,cwd:string|undefined,prompt:string):Promise<CaptureReader|null>}
