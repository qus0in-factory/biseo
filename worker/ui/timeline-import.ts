import type{D1Database}from'@cloudflare/workers-types'
import type{TimelineItem}from'../domain/timeline-types.js'
import{insertTurn}from'../infra/d1-timeline-insert.js'
import{fromItem,toItem}from'../app/timeline-map.js'
export async function importTurn(db:D1Database,i:TimelineItem,owner:string){
 await insertTurn(db,fromItem(i,owner))
 return toItem(fromItem(i,owner))
}
