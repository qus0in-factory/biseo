import{test}from'node:test'
import{strict as a}from'node:assert'
import{TurnStore}from'../app/turn-store.js'
import{queueCompletion}from'./queue-completion.js'
test('terminal transition sends one capability notification, not working or late completion',async()=>{
 const old=process.env.QUEUE_CALLBACK_URL,fetch=globalThis.fetch,seen:any[]=[]
 process.env.QUEUE_CALLBACK_URL='https://queue.example/queue/completed'
 globalThis.fetch=async(u,o)=>{seen.push([u,JSON.parse(o?.body as string)]);return new Response()}
 try{
  const s=new TurnStore();queueCompletion(s,'a','token')
  s.add({requestId:'a',status:'working'} as any)
  a.equal(seen.length,0)
  s.update('a',{status:'timeout'});s.update('a',{status:'completed'})
  a.deepEqual(seen,[['https://queue.example/queue/completed',{requestId:'a',token:'token'}]])
 }finally{globalThis.fetch=fetch;if(old===undefined)delete process.env.QUEUE_CALLBACK_URL;else process.env.QUEUE_CALLBACK_URL=old}
})
