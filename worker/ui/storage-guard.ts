import{type Ctx,jsonNoStore}from'./timeline-guards.js'
export function requireDb(c:Ctx){
 const db=c.env.BISEO_DB
 return db?{ok:true as const,db}:{ok:false as const,res:jsonNoStore(c,{error:'storage_unavailable'},500)}
}
