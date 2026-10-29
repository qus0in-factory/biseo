import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
export async function patchTurn(db:D1Database,id:string,p:Partial<TurnRecord>){
 await db.prepare(`UPDATE timeline_turns SET status=COALESCE(?,status),response_text=COALESCE(?,response_text),error_code=?,completed_at=COALESCE(?,completed_at),target_name=COALESCE(?,target_name),agent_kind=COALESCE(?,agent_kind),next_check_at=NULL,updated_at=? WHERE request_id=?`)
  .bind(p.status??null,p.responseText??null,p.errorCode??null,p.completedAt??null,p.targetName??null,p.agentKind??null,new Date().toISOString(),id).run()
}
export async function markRecoveryPending(db:D1Database,id:string,at:number){
 await db.prepare(`UPDATE timeline_turns SET error_code='recovery_pending',next_check_at=?,updated_at=? WHERE request_id=?`)
  .bind(new Date(at).toISOString(),new Date().toISOString(),id).run()
}
