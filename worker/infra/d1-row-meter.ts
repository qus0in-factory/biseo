import type{D1Database}from'@cloudflare/workers-types'
export type RowCounts={rowsRead:number;rowsWritten:number}
const ORIGINAL=Symbol('d1')
export function meterDb(db:D1Database){
 const counts:RowCounts={rowsRead:0,rowsWritten:0}
 const add=(m?:{rows_read?:number;rows_written?:number})=>{counts.rowsRead+=Number(m?.rows_read??0);counts.rowsWritten+=Number(m?.rows_written??0)}
 const stmt=(s:any):any=>new Proxy(s,{get(t,p){
  if(p===ORIGINAL)return t
  if(p==='bind')return(...a:unknown[])=>stmt(t.bind(...a))
  if(p==='run'||p==='all')return async()=>{const r=await t[p]();add(r.meta);return r}
  const v=t[p];return typeof v==='function'?v.bind(t):v
 }})
 const wrapped=new Proxy(db,{get(t,p){
  if(p==='prepare')return(q:string)=>stmt(t.prepare(q))
  if(p==='batch')return async(ss:any[])=>{const rs=await t.batch(ss.map(s=>s?.[ORIGINAL]??s));rs.forEach((r:any)=>add(r.meta));return rs}
  const v=(t as any)[p];return typeof v==='function'?v.bind(t):v
 }})
 return{db:wrapped as D1Database,counts}
}
