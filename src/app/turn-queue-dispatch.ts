import{runQueue}from'./turn-queue-run.js'
import{clearRetry}from'./availability-retry.js'
import type{TurnDeps}from'./turn-deps.js'
export async function dispatchPane(d:TurnDeps,p:string){
 const q=d.queue
 if(!q.has(p)){clearRetry(p);return}
 if(!q.begin(p))return
 try{await runQueue(d,p,()=>void dispatchPane(d,p))}
 finally{
  const more=q.end(p)
  if(!q.has(p))clearRetry(p)
  if(more)void dispatchPane(d,p)
 }
}
