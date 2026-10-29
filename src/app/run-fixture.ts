import {PaneLocks}from'./pane-locks.js'
import {TurnStore}from'./turn-store.js'
import type{PaneInfo}from'../domain/herdr.js'
import {agent,pane}from'./turn-data-fixture.js'
import {item}from'./run-data-fixture.js'
export function setup(over:{pane?:PaneInfo;error?:unknown}={}){
 const store=new TurnStore(),locks=new PaneLocks(),calls={prompt:0}
 store.add({...item})
 locks.reserve('w:p1','r1')
 const herdr={listPanes:async()=>[pane],listAgents:async()=>[agent],getPane:async()=>over.pane??pane,getAgent:async()=>agent,prompt:async()=>{calls.prompt++;if(over.error)throw over.error}}
 return {d:{herdr,store,locks,timeoutMs:1000,graceMs:0,lateCaptureMs:0},store,locks,calls}
}
