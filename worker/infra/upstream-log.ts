type Src=string|{req:{header(n:string):string|undefined}}
const ok=(s?:string)=>s&&/^[A-Za-z0-9_-]{1,64}$/.test(s)?s:undefined
export const resolveRequestId=(s?:Src)=>
 (typeof s==='string'?ok(s):ok(s?.req.header('cf-ray'))||ok(s?.req.header('x-request-id')))||crypto.randomUUID()
const out=(msg:string,requestId:string,t:number,x:object)=>
 console.log(JSON.stringify({msg,requestId,...x,durationMs:Date.now()-t}))
export const logUpstream=(id:string,m:string,p:string,s:number,t:number)=>
 out('worker.upstream',id,t,{method:m,path:p,status:s})
export function trackSse(s:ReadableStream,id:string,sig:AbortSignal){
 const r=s.getReader(),t=Date.now(),A='client_abort';let d=0
 const end=(reason:string)=>d||(d=1,out('worker.sse.close',id,t,{reason}))
 sig.addEventListener('abort',()=>end(A),{once:true})
 return new ReadableStream({
  pull:c=>r.read().then(x=>x.done?(end(sig.aborted?A:'upstream_closed'),c.close()):c.enqueue(x.value),e=>{end(sig.aborted?A:'error');throw e}),
  cancel:x=>(end(A),r.cancel(x)),
 })
}
