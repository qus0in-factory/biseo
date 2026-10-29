import type{Reply}from'../domain/herdr-event.js'
export type Ctx={resolve:()=>void;reject:(e:Error)=>void;onEvent:(e:string)=>void;onClose:()=>void;close:()=>void}
export function handle(r:Reply|null,c:Ctx){
 if(!r)return
 if(r.event)return c.onEvent(r.event)
 if(r.id!=='sub')return
 if(r.error){c.reject(new Error(r.error.code??'herdr_events_unavailable'));c.onClose();return c.close()}
 if(r.result?.type==='subscription_started')c.resolve()
}
