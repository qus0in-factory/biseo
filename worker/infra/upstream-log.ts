import{logEvent as out,logCode}from'./log-event.js'
type Src=string|{req:{header(n:string):string|undefined}}
const ok=(s?:string)=>s&&/^[A-Za-z0-9_-]{1,64}$/.test(s)?s:undefined
export const resolveRequestId=(s?:Src)=>
 (typeof s==='string'?ok(s):ok(s?.req.header('cf-ray'))||ok(s?.req.header('x-request-id')))||crypto.randomUUID()
export const logUpstream=(id:string,m:string,p:string,s:number,t:number,c?:unknown)=>
 out('worker.upstream',id,t,{method:m,path:p,status:s,...c?{code:logCode(c)}:{}})
export{trackSse}from'./sse-log.js'
