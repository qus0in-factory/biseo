export class PaneLocks{
 private m=new Map<string,string>()
 private req=new Set<string>()
 has(paneId:string){return this.m.has(paneId)}
 reserve(paneId:string,id:string){
  if(this.m.has(paneId))return false
  this.m.set(paneId,id)
  return true
 }
 release(paneId:string,id:string){if(this.m.get(paneId)===id)this.m.delete(paneId)}
 reserveRequest(id:string){
  if(this.req.has(id))return false
  this.req.add(id)
  return true
 }
 releaseRequest(id:string){this.req.delete(id)}
}
