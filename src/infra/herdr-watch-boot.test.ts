import test from'node:test'
import assert from'node:assert/strict'
import {startQueueWatch}from'./herdr-watch-boot.js'
import {logger}from'./logger.js'
import {makeDeps}from'../app/turn-fixture.js'
import {reader}from'../app/turn-data-fixture.js'
test('watch disabled logs one warning',()=>{
 const old=logger.warn
 let n=0
 logger.warn=((..._a:unknown[])=>{n++})as typeof logger.warn
 try{startQueueWatch({...makeDeps(reader),allowedWorkspaceId:undefined})}
 finally{logger.warn=old}
 assert.equal(n,1)
})
