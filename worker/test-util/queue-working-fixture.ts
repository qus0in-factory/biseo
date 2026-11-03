import type{D1Database}from'@cloudflare/workers-types'
import{insertRow}from'./d1-row.js'
export async function workingRow(db:D1Database){
 await insertRow(db,'r1','owner','w1T','working')
 await db.prepare("UPDATE timeline_turns SET terminal_id='t1',lease_token='token',lease_until=? WHERE request_id='r1'")
 .bind(Date.now()+120000).run()
}
