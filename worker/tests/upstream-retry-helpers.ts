import{callUpstreamJson}from'../infra/herdr-upstream-http.js'
export async function run(env:any,m:'GET'|'POST',fn:(n:number)=>Response){
 let n=0
 const f0=globalThis.fetch
 globalThis.fetch=(async()=>fn(++n))as any
 try{
  return{res:await callUpstreamJson(env,'/herdr/turns/r1',m,undefined,'tid'),n}
 }finally{globalThis.fetch=f0}
}
export const err=(status:number)=>Response.json({error:'x'},{status})
export const ok=()=>Response.json({requestId:'r1'},{status:200})
