import type{TurnRecord}from'../domain/timeline-record.js'
export type QueueTarget={terminalId:string;ready:boolean}
export interface QueuePort{
 target(workspace:string,pane:string):Promise<QueueTarget|null>
 execute(r:TurnRecord,token?:string):Promise<boolean>
}
