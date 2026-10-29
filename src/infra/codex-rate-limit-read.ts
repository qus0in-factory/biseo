import{open}from'node:fs/promises'
import{parseRateLimits}from'./codex-rate-limit-parse.js'
import type{RateLimits}from'../domain/availability.js'
const tail=262144
export async function readRateLimits(path:string):Promise<RateLimits|null>{
 const fh=await open(path,'r').catch(()=>null)
 if(!fh)return null
 try{
  const{size}=await fh.stat(),len=Math.min(size,tail),b=Buffer.allocUnsafe(len)
  const{bytesRead}=await fh.read(b,0,len,size-len)
  const lines=b.subarray(0,bytesRead).toString('utf8').split('\n')
  for(let i=lines.length-1;i>=0;i--){
   if(!lines[i].includes('"token_count"'))continue
   const r=parseRateLimits(lines[i])
   if(r)return r
  }
  return null
 }catch{return null}finally{await fh.close().catch(()=>{})}
}
