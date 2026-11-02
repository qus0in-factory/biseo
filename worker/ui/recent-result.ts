import type{RecentResponse}from'../../shared/domain/recent-response.js'
import{importRecent}from'../app/import-recent.js'
import{type Ctx,jsonNoStore}from'./timeline-guards.js'
import type{D1Database}from'@cloudflare/workers-types'
export async function recentResult(context:Ctx,db:D1Database,recent:RecentResponse|null,workspace:string,pane:string,owner:string){
 if(!recent)return jsonNoStore(context,{state:'empty'},200)
 const inserted=await importRecent(db,recent,workspace,pane,owner)
 return jsonNoStore(context,{state:inserted?'imported':'duplicate'},200)
}
