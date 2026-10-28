import type{Logger}from'pino'
import {logger}from'./logger.js'
export function startSseLog(log:Logger=logger){
 const t0=Date.now()
 log.info({event:'sse.open'},'sse.open')
 return (aborted:boolean,cause:unknown)=>{
  const reason=typeof cause==='string'?cause:aborted?'client_abort':cause!==undefined?'write_error':'upstream_closed'
  log.info({event:'sse.close',reason,durationMs:Date.now()-t0},'sse.close')
 }
}
