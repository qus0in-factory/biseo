import type{TestContext}from'node:test'
// ky waits for its backoff between retries; drive mocked timers until the call settles.
export async function drive<T>(t:TestContext,p:Promise<T>,stepMs=600,maxTicks=20):Promise<T>{
 let done=false
 const tracked=p.then(
  v=>{done=true;return v},
  e=>{done=true;throw e},
 )
 for(let i=0;i<maxTicks&&!done;i++){
  await new Promise(r=>setImmediate(r))
  if(!done)t.mock.timers.tick(stepMs)
 }
 if(!done)throw new Error('retry driver did not settle')
 return tracked
}
