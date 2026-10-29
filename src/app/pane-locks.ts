export class PaneLocks{
 private m=new Map<string,string>()
 private req=new Set<string>()
 private subs=new Set<(paneId:string)=>void>()
 has(paneId:string){return this.m.has(paneId)}
 reserve(paneId:string,id:string){
  if(this.m.has(paneId))return false
  this.m.set(paneId,id)
  this.emit(paneId)
  return true
 }
 release(paneId:string,id:string){
  if(this.m.get(paneId)!==id)return
  this.m.delete(paneId)
  this.emit(paneId)
 }
 reserveRequest(id:string){
  if(this.req.has(id))return false
  this.req.add(id)
  return true
 }
 releaseRequest(id:string){this.req.delete(id)}
 subscribe(f:(paneId:string)=>void){this.subs.add(f);return()=>{this.subs.delete(f)}}
 private emit(paneId:string){for(const f of [...this.subs])try{f(paneId)}catch{}}
}
