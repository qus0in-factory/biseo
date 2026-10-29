import test from'node:test'
import assert from'node:assert/strict'
import {createCapture}from'./transcript-capture.js'
test('unsupported session returns no reader',async()=>{
 assert.equal(await createCapture().begin({source:'herdr:codex',agent:'codex',kind:'id',value:'s'},'/tmp','hi'),null)
})
