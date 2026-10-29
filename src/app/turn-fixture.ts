import {PaneLocks}from'./pane-locks.js'
import {TurnStore}from'./turn-store.js'
import {TurnQueue}from'./turn-queue.js'
import type{TurnDeps}from'./turn-deps.js'
import type{CaptureReader}from'./ports.js'
import {agent,pane}from'./turn-data-fixture.js'
export function makeDeps(cap:CaptureReader|null):TurnDeps{
 return {allowedWorkspaceId:'w',timeoutMs:1000,graceMs:0,store:new TurnStore(),locks:new PaneLocks(),queue:new TurnQueue(),capture:{begin:async()=>cap},herdr:{listPanes:async()=>[pane],listAgents:async()=>[agent],getPane:async()=>pane,getAgent:async()=>agent,prompt:async()=>{}}}
}
