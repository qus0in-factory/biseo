import type{Target}from'../domain/turn-policy.js'
import type{TimelineItem}from'../domain/timeline.js'
import {captureTurn}from'./capture-turn.js'
import {finish}from'./finish-turn.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
import type{PaneLocks}from'./pane-locks.js'
import {release}from'./turn-claim.js'
import {recheck}from'./recheck-target.js'
import type{TurnStore}from'./turn-store.js'
type Deps={herdr:HerdrPort;store:TurnStore;locks:PaneLocks;timeoutMs:number;graceMs:number;promptAcceptanceMs?:number}
export async function runTurn(d:Deps,item:TimelineItem,reader:CaptureReader,target:Target){
 try{
  d.store.update(item.requestId,{status:'working'})
  const r=await recheck(d.herdr,item.paneId,target)
  if(!r.ok)return finish(d.store,item.requestId,r.status,r.errorCode)
  return await captureTurn(d,item,reader)
 }catch{
  return finish(d.store,item.requestId,'failed','herdr_error')
 }finally{
  release(d,item.paneId,item.requestId)
 }
}
