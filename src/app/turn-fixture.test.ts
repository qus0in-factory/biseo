import {PaneLocks}from'./pane-locks.js'
import {TurnStore}from'./turn-store.js'
import type{TurnDeps}from'./turn-deps.js'
import type{CaptureReader}from'./ports.js'
import {agent,pane}from'./turn-fixture-data.test.js'
export function makeDeps(cap:CaptureReader|null):TurnDeps{
 return {allowedWorkspaceId:'w',store:new TurnStore(),locks:new PaneLocks(),capture:{begin:async()=>cap},herdr:{listPanes:async()=>[pane],listAgents:async()=>[agent],getPane:async()=>pane,getAgent:async()=>agent,prompt:async()=>{}}}
}
