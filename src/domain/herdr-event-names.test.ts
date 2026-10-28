import test from'node:test'
import assert from'node:assert/strict'
import {isCloseEvent}from'./herdr-event-names.js'
test('matches socket snake_case and subscription dot names',()=>{
 assert.equal(isCloseEvent('pane_created'),true)
 assert.equal(isCloseEvent('pane.created'),true)
 assert.equal(isCloseEvent('pane_closed'),true)
 assert.equal(isCloseEvent('pane_updated'),false)
})
