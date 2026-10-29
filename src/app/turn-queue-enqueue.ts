import{makeItem}from'./turn-item.js'
import{dispatchPane}from'./turn-queue-dispatch.js'
import{bindQueue}from'./turn-queue-bind.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
import type{Target}from'../domain/turn-policy.js'
import type{Ok}from'./turn-result.js'
export function enqueue(d:TurnDeps,input:TurnInput,target:Target):Ok{
 const item=makeItem(input,target,d.store.next())
 d.store.add(item)
 d.queue.add(item)
 bindQueue(d)
 d.watch?.()
 void dispatchPane(d,input.paneId)
 return{ok:true,item,reader:null,created:true,target:null}
}
