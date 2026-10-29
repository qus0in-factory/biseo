import type{Target}from'../domain/turn-policy.js'
import type{TimelineItem}from'../domain/timeline.js'
import type{CaptureReader}from'./ports.js'
export type Fail={ok:false;status:400|403|404|409|502|503;error:string;reason?:string;resetsAt?:string}
export type Ok={ok:true;item:TimelineItem;reader:CaptureReader|null;created:boolean;target:Target|null}
export const fail=(status:Fail['status'],error:string,reason?:string,resetsAt?:string):Fail=>({ok:false,status,error,reason,...(resetsAt?{resetsAt}:{})})
