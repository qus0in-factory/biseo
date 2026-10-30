import assert from'node:assert/strict'
import{ok}from'./upstream-retry-helpers.js'
import{retryCase}from'./upstream-retry-case.js'
export const retriesNetwork=async(t:any)=>{
 const g=await retryCase(t,n=>{
  if(n===1)throw new TypeError('fetch failed')
  return ok()
 })
 assert.equal(g.n,2)
 assert.equal(g.res.ok,true)
}
