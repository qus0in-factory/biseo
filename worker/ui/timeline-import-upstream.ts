import type{D1Database}from'@cloudflare/workers-types'
import type{HerdrUpstreamPort}from'../app/timeline-ports.js'
import{fromItem}from'../app/timeline-map.js'
import{insertTurn}from'../infra/d1-timeline-insert.js'
export async function importFromUpstream(db:D1Database,up:HerdrUpstreamPort,id:string,ws:string,owner:string){
 const existing=await db.prepare('SELECT request_id FROM timeline_turns WHERE request_id=?').bind(id).first()
 if(existing)return null
 const got=await up.getTurn(id)
 if(!got.ok||got.data.requestId!==id||got.data.workspaceId!==ws)return null
 const inserted=await insertTurn(db,fromItem(got.data,owner))
 return inserted==='inserted'?got.data:null
}
