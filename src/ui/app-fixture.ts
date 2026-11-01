import {createApp}from'./app.js'
import {PaneLocks}from'../app/pane-locks.js'
import {TurnStore}from'../app/turn-store.js'
import {TurnQueue}from'../app/turn-queue.js'
import {agent,pane}from'./app-data-fixture.js'
export function makeApp(capture:unknown=null){
 return createApp({verify:async (t?:string)=>{if(t!=='x')throw new Error('no')},healthStatus:'ok',allowedWorkspaceId:'w',store:new TurnStore(),locks:new PaneLocks(),queue:new TurnQueue(),capture:{begin:async()=>capture},herdr:{listPanes:async()=>[pane],listAgents:async()=>[agent],listWorkspaces:async()=>[{workspace_id:'w',id:'w',label:'main',focused:true,pane_count:1}],getPane:async()=>pane,getAgent:async()=>agent,prompt:async()=>{}},timeoutMs:1000,graceMs:0} as never)
}
