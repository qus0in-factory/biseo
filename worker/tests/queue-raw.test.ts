import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {parseSubmitMessageInput} from '../domain/message-input.js'
test('idempotency compares original prompt including whitespace',async()=>{
 const {put}=await queueFixture()
 const body={requestId:'a',workspaceId:'w',paneId:'p',text:' hi '}
 assert.equal(parseSubmitMessageInput(body)?.text,' hi ')
 await put('a','p','o','w',body.text)
 assert.equal((await put('a','p','o','w','hi')).kind,'conflict')
 assert.equal(parseSubmitMessageInput({...body,text:'  '}),null)
})
