import type{AgentInfo}from'../domain/herdr.js'
import type{TurnStatus}from'../domain/timeline.js'
import type{CaptureReader}from'./ports.js'
export type LateDone=(st:TurnStatus,err:string|null,txt?:string|null)=>void
export type LateOpts={
 pane:string
 gen:number
 rdr:CaptureReader
 ms?:number
 chk?:()=>Promise<AgentInfo|undefined>
 isLive:()=>boolean
 onDone:LateDone
}
