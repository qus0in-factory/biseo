import {prepare}from'./prepare-turn.js'
import {makeItem}from'./turn-item.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
import {fail,type Fail,type Ok}from'./turn-result.js'
import {existing}from'./turn-idempotency.js'
import {claim,release}from'./turn-claim.js'
export async function createTurn(d:TurnDeps,input:TurnInput):Promise<Ok|Fail>{
 const old=existing(d,input)
 if(old)return old
 const c=claim(d,input.paneId,input.requestId)
 if(c)return c
 const unlock=()=>release(d,input.paneId,input.requestId)
 try{
  const p=await prepare(d,input)
  if('ok' in p){unlock();return p}
  if(!p.reader){unlock();return fail(409,'target_not_ready','response_capture_unavailable')}
  const item=makeItem(input,p.target,d.store.next())
  d.store.add(item)
  return {ok:true,item,reader:p.reader,created:true,target:p.target}
 }catch{
  unlock()
  return fail(502,'herdr_unavailable')
 }
}
