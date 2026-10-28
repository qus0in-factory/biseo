import {prepare}from'./prepare-turn.js'
import {makeItem}from'./turn-item.js'
import type{TurnDeps}from'./turn-deps.js'
import {sameInput,type TurnInput}from'./turn-input.js'
import {fail,type Fail,type Ok}from'./turn-result.js'
export async function createTurn(d:TurnDeps,input:TurnInput):Promise<Ok|Fail>{
 const old=d.store.get(input.requestId)
 if(old)return sameInput(old,input)?{ok:true,item:old,reader:null,created:false,target:null}:fail(409,'conflict','request_id_payload_mismatch')
 if(!d.locks.reserve(input.paneId,input.requestId))return fail(409,'target_not_ready','agent_busy')
 const unlock=()=>d.locks.release(input.paneId,input.requestId)
 try{
  const p=await prepare(d,input)
  if('ok' in p){unlock();return p}
  const item=makeItem(input,p.target,d.store.next(),p.reader,p.reason)
  d.store.add(item)
  if(!p.reader)unlock()
  return {ok:true,item,reader:p.reader,created:true,target:p.target}
 }catch{
  unlock()
  return fail(502,'herdr_unavailable')
 }
}
