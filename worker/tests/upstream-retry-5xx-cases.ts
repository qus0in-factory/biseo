import assert from'node:assert/strict'
import{err,ok}from'./upstream-retry-helpers.js'
import{retryCase}from'./upstream-retry-case.js'
export const retries5xx=async(t:any)=>{
 const g=await retryCase(t,n=>n<3?err(502):ok())
 assert.equal(g.n,3)
 assert.equal(g.res.ok,true)
}
export const givesUp=async(t:any)=>{
 const g=await retryCase(t,()=>err(500))
 assert.equal(g.n,3)
 assert.deepEqual([g.res.ok,g.res.status],[false,500])
}
