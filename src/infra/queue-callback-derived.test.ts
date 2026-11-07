import{test}from'node:test'
import{strict as a}from'node:assert'
import{mkdtemp,writeFile,rm}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{queueCallbackUrl as url}from'./queue-callback-url.js'
test('Worker URL and source warnings',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'callback-')),path=join(dir,'wrangler.jsonc')
 const logs:string[]=[],warn=(s:string)=>{logs.push(s)}
 try{
  await writeFile(path,'{"routes":[{"custom_domain":true,"pattern":"app.test"}]}')
  a.equal(await url(undefined,undefined,path,warn),'https://app.test/api/queue/completed')
  a.equal(logs.length,0)
  for(const text of ['{}','{"routes":[{"pattern":"zone/*"}]}','{']){
   await writeFile(path,text)
   a.equal(await url(undefined,undefined,path,warn),undefined)
  }
  await rm(path)
  a.equal(await url(undefined,undefined,path,warn),undefined)
  a.deepEqual(logs,Array(4).fill('queue.callback_unresolved: set QUEUE_CALLBACK_URL'))
 }finally{await rm(dir,{recursive:true,force:true})}
})
