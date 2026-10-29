import {randomUUID}from'node:crypto'
import type{Context,Next}from'hono'
import type{Logger}from'pino'
import {logger}from'../infra/logger.js'
const RE=/^[A-Za-z0-9_-]{1,64}$/
const valid=(s?:unknown)=>typeof s==='string'&&RE.test(s)?s:undefined
export function requestLogger(log:Logger=logger){
 return async(c:Context,next:Next)=>{
  const t0=Date.now()
  await next()
  let reqId=valid(c.req.header('x-request-id'))||valid(c.req.param('requestId'))
  if(!reqId&&(c.req as unknown as{bodyCache?:{text?:unknown}}).bodyCache?.text){
   const b=(await c.req.json().catch(()=>null)) as{requestId?:unknown}|null
   reqId=valid(b?.requestId)
  }
  const requestId=reqId||randomUUID()
  c.header('x-request-id',requestId)
  log.info({requestId,method:c.req.method,path:c.req.path,status:c.res.status,durationMs:Date.now()-t0},'http.request')
 }
}
