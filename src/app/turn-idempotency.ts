import {sameInput,type TurnInput}from'./turn-input.js'
import {fail,type Fail,type Ok}from'./turn-result.js'
import type{TurnDeps}from'./turn-deps.js'
export function existing(d:TurnDeps,input:TurnInput):Ok|Fail|undefined{
 const old=d.store.get(input.requestId)
 if(!old)return
 return sameInput(old,input)?{ok:true,item:old,reader:null,created:false,target:null}:fail(409,'conflict','request_id_payload_mismatch')
}
