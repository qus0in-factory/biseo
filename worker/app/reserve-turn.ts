import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import{findTurn}from'../infra/d1-timeline-find.js'
import{insertTurn}from'../infra/d1-timeline-insert.js'
import{reservationMatches}from'../infra/d1-reservation-match.js'
export type Reserve={kind:'inserted'}|{kind:'existing';rec:TurnRecord}|{kind:'busy'|'conflict'}
export async function reserveTurn(db:D1Database,r:TurnRecord):Promise<Reserve>{
 const x=await insertTurn(db,r)
 if(x==='inserted')return{kind:'inserted'}
 if(x==='busy')return{kind:'busy'}
 if(!await reservationMatches(db,r))return{kind:'conflict'}
 const rec=await findTurn(db,{workspaceId:r.workspaceId,ownerSubject:r.ownerSubject},r.requestId)
 return rec?{kind:'existing',rec}:{kind:'busy'}
}
