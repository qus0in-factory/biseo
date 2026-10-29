import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import {agent}from'./turn-data-fixture.js'
test('working after send is collected instead of treated as uncertain',async()=>{
 const s=setup()
 s.d.herdr.getAgent=async()=>({...agent,agent_status:'working'})
 await captureTurn(s.d,item,{read:async()=>'answer'})
 assert.equal(s.store.get('r1')?.status,'completed')
 assert.equal(s.store.get('r1')?.responseText,'answer')
})
