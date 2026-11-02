import type{HerdrPort}from'./ports.js'
import{observePaneModel}from'./pane-model-observe.js'
import type{PaneModel}from'../domain/pane-model-parse.js'
type Hit={at:number;value:Promise<PaneModel|null>;last?:PaneModel}
export function createPaneModelCache(ttlMs=5000,clock=()=>Date.now()){
 const cache=new Map<string,Hit>()
 return async(h:HerdrPort,panes:{paneId:string;agentKind:string|null}[],now=clock())=>{
  const out:Record<string,PaneModel>={},ids=new Set(panes.map(p=>p.paneId))
  for(const k of cache.keys())if(!ids.has(k))cache.delete(k)
  await Promise.all(panes.map(async p=>{
   let c=cache.get(p.paneId)
   if(!c||now-c.at>=ttlMs){
    c={at:Infinity,value:observePaneModel(h,p.paneId,p.agentKind),last:c?.last}
    cache.set(p.paneId,c)
    void c.value.then(()=>{c!.at=clock()})
   }
   const v=await c.value,model=v??c.last
   if(model){if(v)c.last=v;out[p.paneId]=model}
  }))
  return out
 }
}
export const paneModelCache=createPaneModelCache(Number(process.env.BISEO_PANE_MODEL_TTL_MS??5000))
