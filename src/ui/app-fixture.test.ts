import {createApp}from'./app.js'
import {PaneLocks}from'../app/pane-locks.js'
import {TurnStore}from'../app/turn-store.js'
import {agent,pane}from'./app-fixture-data.test.js'
export function makeApp(capture:unknown=null){
 return createApp({verify:async t=>{if(t!=='x')throw new Error('no')},healthStatus:'ok',allowedWorkspaceId:'w',store:new TurnStore(),locks:new PaneLocks(),capture:{begin:async()=>capture},herdr:{listPanes:async()=>[pane],listAgents:async()=>[agent],getPane:async()=>pane,getAgent:async()=>agent,prompt:async()=>{}},timeoutMs:1000,graceMs:0} as never)
}
