import{logEvent as out}from'./log-event.js'
export function trackSse(s:ReadableStream,id:string,sig:AbortSignal){
 const r=s.getReader(),t=Date.now(),A='client_abort';let d=0
 const end=(reason:string)=>d||(d=1,out('worker.sse.close',id,t,{reason}))
 sig.addEventListener('abort',()=>end(A),{once:true})
 return new ReadableStream({
  pull:c=>r.read().then(x=>x.done?(end(sig.aborted?A:'upstream_closed'),c.close()):c.enqueue(x.value),e=>{end(sig.aborted?A:'error');throw e}),
  cancel:x=>(end(A),r.cancel(x)),
 })
}
