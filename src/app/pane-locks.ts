export class PaneLocks{
 private m=new Map<string,string>()
 has(paneId:string){return this.m.has(paneId)}
 reserve(paneId:string,id:string){
  if(this.m.has(paneId))return false
  this.m.set(paneId,id)
  return true
 }
 release(paneId:string,id:string){if(this.m.get(paneId)===id)this.m.delete(paneId)}
 all(){return this.m}
}
