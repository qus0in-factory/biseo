import type{WorkspaceApiPort as P}from'../domain/ports'
import{addOlder,canLoadOlder}from'../domain/timelinePaging'
import type{Paging,TimelinePage}from'../domain/timelinePagingTypes'

type Refs={
 p:P;w:string|null;paneId:string|null;ref:{current:Paging}
 setPaging:(f:(s:Paging)=>Paging)=>void;gen:{current:number}
 loading:{current:boolean};requested:{current:number|null}
}

export const loadOlderPage=async(r:Refs):Promise<TimelinePage|null>=>{
 const s=r.ref.current
 if(!r.w||!r.paneId||!r.p.getTimeline||!canLoadOlder(s,r.loading.current,r.requested.current))return null
 r.loading.current=true
 r.requested.current=s.before
 const g=r.gen.current
 try{
  const page=await r.p.getTimeline(r.w,{paneId:r.paneId,before:s.before,limit:3})
  if(g!==r.gen.current)return null
  r.setPaging(x=>addOlder(x,page))
  return page
 }catch{
  r.requested.current=null
  return null
 }finally{r.loading.current=false}
}
