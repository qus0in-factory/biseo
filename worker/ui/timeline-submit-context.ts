import{type Ctx,checkCsrf,jsonNoStore,requireOwner}from'./timeline-guards.js'
import{requireDb}from'./storage-guard.js'
export async function submitContext(c:Ctx){
 const csrf=checkCsrf(c);if(csrf)return{ok:false as const,res:csrf}
 const a=await requireOwner(c);if(!a.ok)return{ok:false as const,res:a.res}
 const d=requireDb(c);if(!d.ok)return{ok:false as const,res:d.res}
 return{ok:true as const,owner:a.claims.sub,db:d.db}
}
export const badRequest=(c:Ctx)=>jsonNoStore(c,{error:'bad_request'},400)
