import {open,stat}from'node:fs/promises'
import {watch,type FSWatcher}from'node:fs'
import {dirname}from'node:path'
export async function sizeOf(path:string){return stat(path).then(s=>s.size).catch(()=>0)}
export async function readNew(path:string,offset:number):Promise<string>{
 const fh=await open(path,'r').catch(()=>null)
 if(!fh)return ''
 try{
  const {size}=await fh.stat()
  const pos=size<offset?0:offset,len=size-pos
  if(len<=0)return ''
  const buf=Buffer.allocUnsafe(len)
  const {bytesRead}=await fh.read(buf,0,len,pos)
  const s=buf.subarray(0,bytesRead),nl=s.lastIndexOf(10)
  return nl<0?'':s.subarray(0,nl+1).toString('utf8')
 }catch{return ''}finally{await fh.close().catch(()=>{})}
}
export function waitChange(path:string,ms:number):Promise<void>{
 return new Promise(res=>{
  const ws:FSWatcher[]=[]
  const done=()=>{clearTimeout(t);for(const w of ws)w.close();res()}
  const t=setTimeout(done,Math.max(0,ms))
  for(const target of [dirname(path),path])try{ws.push(watch(target,done))}catch{}
 })
}
