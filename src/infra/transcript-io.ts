import {readFile,stat}from'node:fs/promises'
import {watch,type FSWatcher}from'node:fs'
import {dirname}from'node:path'
export async function sizeOf(path:string){return stat(path).then(s=>s.size).catch(()=>0)}
export async function readNew(path:string,offset:number):Promise<string>{
 const buf=await readFile(path).catch(()=>null)
 if(!buf)return ''
 return buf.subarray(buf.length<offset?0:offset).toString('utf8')
}
export function waitChange(path:string,ms:number):Promise<void>{
 return new Promise(res=>{
  const ws:FSWatcher[]=[]
  const done=()=>{clearTimeout(t);for(const w of ws)w.close();res()}
  const t=setTimeout(done,Math.max(0,ms))
  for(const target of [dirname(path),path])try{ws.push(watch(target,done))}catch{}
 })
}
